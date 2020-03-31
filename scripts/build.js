'use strict';
const util = require('util');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const pkg = require('../package');

// 找到需要构建的主项目目录
let mainProjectWorkDir = path.join(__dirname, '../', 'packages', 'wodax-project');
const rootWorkDir = path.normalize(path.join(__dirname, '../'));
let allSubProjectDirs = [];

// 支持多子项目打包
// 检查`mainProjectWorkDir`是否存在
try {
  let foundSubProject = false;
  const subMainPrjPaths = [
    path.join(__dirname, '../', 'packages', 'wodax-project'),
    path.join(__dirname, '../', 'packages', 'wodax-core-h5')
  ];

  subMainPrjPaths.forEach(onePath => {
    if (fs.existsSync(onePath)) {
      allSubProjectDirs.push(onePath);
      foundSubProject = true;
    }
  });

  if (!foundSubProject) {
    console.error(`${chalk.red('检测到错误:')} \n找到不到主要工程所在目录 "${subMainPrjPaths.join(`\n`)}", \n请检查拼写错误!!!   --- ${getNowDate()}`);
    process.exit(999);
  } else {
    console.log(`${chalk.gray('===> 所有主子工程目录检查: ')} 已找到, 路径如下: \n${allSubProjectDirs.join('\n')} \n`);
  }
} catch (e) {
  console.log(e)
}


/** 获取当前时间
 * @example 2019-7-11 17:11:54
 * @returns {string}
 */
function getNowDate() {
  return (new Date()).toLocaleString();
}

const traceStartCommand = (command) => {
  try {
    console.log(`${chalk.gray('>>>[命令开始]')} ${command}  --- ${getNowDate()}`);
  } catch (e) {
  }
  return Date.now();
};
const traceEndCommand = (command, startTime) => {
  try {
    const runningTotalTime = (Date.now() - startTime) / 1000;
    console.log(`${chalk.gray('<<<[命令结束]')} ${command}  用时：${runningTotalTime} 秒 --- ${getNowDate()}`);
  } catch (e) {
  }
};
const traceRunError = (e) => {
  let errInfo = ``;
  try {
    errInfo = util.inspect(e, {depth: 5, color: true, compact: false});
  } catch (e) {
    console.error(e);
  }
  console.error(`${chalk.red('检测到错误:')} ${errInfo}  --- ${getNowDate()}`);
};
const traceOutContent = (prefix, content) => {
  try {
    console.log(`${chalk.gray(prefix)} ${content}`);
  } catch (e) {
  }
};
const traceProcessInfo = (prefix, process) => {
  try {
    const {command, exitCode, exitCodeName, stdout, stderr, failed, timedOut, isCanceled, killed} = process;
    const info = [
      `command: ${command}`,
      `exitCode: ${exitCode}`,
      `exitCodeName: ${exitCodeName}`,
      `failed: ${failed}`,
      `timedOut: ${timedOut}`,
      `isCanceled: ${isCanceled}`,
      `killed: ${killed}`,
    ];
    console.log(`${chalk.gray(prefix)}`);
    console.log(`${chalk.yellow(info.join('\n'))}`);

    // stdout
    if (stdout) {
      console.log(`${chalk.green(stdout)}`);
    }
    // stderr
    if (stderr) {
      console.log(`${chalk.red(stderr)}`);
    }
  } catch (e) {
  }
};

/**
 * 封装异步Foreach
 * @param {array} arr
 * @param {function} callback
 * @returns {object} {Promise<void>}
 */
const asyncForeach = async (arr, callback) => {
  const length = arr.length;
  const o = Object(arr);
  let k = 0;
  while (k < length) {
    if (k in o) {
      const kValue = o[k];
      await callback(kValue, k, o);
    }
    k += 1;
  }
};


/** 同步运行命令
 * @param {string} command 字符串命令
 * @param {object} options 运行选项参数，参照`execa`的说明
 * @param {boolean} strict 是否严格处理，碰到错误，直接错误
 */
function syncRunCommand(command, options, strict) {
  let subProcess = null;
  try {
    const startTime = traceStartCommand(command);
    subProcess = execa.commandSync(command, {
      ...options,
      timeout: 1000 * 60 * 60, /// 单位毫秒
    });
    traceProcessInfo(`>>>`, subProcess);
    traceEndCommand(command, startTime);
  } catch (e) {
    traceRunError(e);
    if (strict) {
      process.exit(1);
    }
  }
}

/** 异步运行命令
 *
 * @param command 字符串命令
 * @param options options 运行选项参数，参照`execa`的说明
 * @param strict  是否严格处理，碰到错误，直接错误
 * @returns {Promise<any>}
 */
function asyncRunCommand(command, options, strict) {
  return new Promise((resolve, reject) => {
    try {
      (async () => {
        try {
          const startTime = traceStartCommand(command);
          const subProcess = execa.command(command, options);

          subProcess.stdout.on('data', (data) => {
            traceOutContent('>>>[stdout]:', data.toString('utf-8'));
          });

          subProcess.stderr.on('data', (data) => {
            traceOutContent('>>>[stderr]:', data.toString('utf-8'));
          });

          let isResolve = false;
          const resolveCall = (code, signal) => {
            if (!isResolve) {
              isResolve = true;
              if (code && signal) {
                traceOutContent(`>>>(code, signal)=`, `code=${code}, signal=${signal}`);
              }
              traceEndCommand(command, startTime);
              resolve();
            }
          };

          subProcess.on('exit', (code, signal) => {
            resolveCall(code, signal);
          });
          subProcess.on('error', (err) => {
            traceRunError(err);
            if (strict) {
              process.exit(1);
            } else {
              resolveCall();
            }
          });

        } catch (e) {
          traceRunError(e);
          if (strict) {
            process.exit(1);
          } else {
            reject(e);
          }
        }
      })();
    } catch (e) {
      traceRunError(e);
      if (strict) {
        process.exit(1);
      } else {
        reject(e);
      }
    }
  }).catch((reason) => {
    traceRunError(reason);
    if (strict) {
      process.exit(1);
    }
  });
}

/** 主要运行入口
 */
function run() {
  const buildApplicationVersion = pkg.version;                    // 获取包的版本

  // 从运维Shell进程中读取环境变量:
  // 变量含义，可以@叶俊青
  const buildApplicationName = process.env['name'] || '';         // 构建应用名称
  const buildEnv = process.env['env'] || '';                      // 构建环境：sit, alpha, uat, production
  const buildGitUrl = process.env['GitUrl'] || '';                // git 路径
  const buildGitBranch = process.env['branch'] || '';             // git 分支名称
  const buildGitCommitId = process.env['GIT_COMMIT'] || '';       // git commit id， 可以作为构建ID
  const buildDateTime = Date.now() || '';                         // 构建时间

  // 整理环境变量处理
  const prefix = `WODAX_BUILD_`;
  const envCommands = [
    'cross-env',
    `${prefix}APPLICATION_NAME="${buildApplicationName}"`,
    `${prefix}APPLICATION_VERSION="${buildApplicationVersion}"`,
    `${prefix}ENV="${buildEnv}"`,
    `${prefix}DATETIME="${buildDateTime}"`,
    `${prefix}GIT_URL="${buildGitUrl}"`,
    `${prefix}GIT_BRANCH="${buildGitBranch}"`,
    `${prefix}GIT_COMMIT_ID="${buildGitCommitId}"`,
    `NODE_OPTIONS="--max_old_space_size=4096"`,                  // node内存配置，避免aot时内存溢出： JavaScript heap out of memory
  ];

  // 设置环境变量
  const setEnvCommand = envCommands.join(` `);
  console.log(`${chalk.gray('===> 特殊检测: ')} 环境变量 = ${setEnvCommand}`);

  // 执行以下任务
  const CommandTaskList = [
    {command: `rm -fr ./dist`, options: {cwd: rootWorkDir}, strict: false},
    {command: `npm config list`, options: {cwd: mainProjectWorkDir}, strict: false},
    // { command: `rm -fr ./node_module`, options: {cwd: mainProjectWorkDir}, strict: false},
    {command: `npm i -g yarn`, options: {cwd: mainProjectWorkDir}, strict: false},
    {command: `yarn config list`, options: {cwd: mainProjectWorkDir}, strict: false},
    {command: `yarn install`, options: {cwd: mainProjectWorkDir}, strict: true},
    {command: `${setEnvCommand} yarn build`, options: {cwd: mainProjectWorkDir}, strict: true},
    {command: `mv ./dist ${path.join(rootWorkDir, 'dist')}`, options: {cwd: mainProjectWorkDir}, strict: true},
  ];


  // 采用同步方式，还是异步方式
  const runCommandUseSync = true;
  if (!runCommandUseSync) {
    (async () => {
      asyncForeach(CommandTaskList, async (task, i) => {
        const {command, options, strict} = task;
        await asyncRunCommand(command, options, strict);
      });
    })();
  } else {
    // 顺序同步执行下面命令
    for (const task of CommandTaskList) {
      const {command, options, strict} = task;
      syncRunCommand(command, options, strict);
    }
  }
}

process.on('unhandledRejection', error => {
  traceRunError(error);
  process.exit(1); // To exit with a 'failure' code
});

// ---> run
try {
  const cmdDescription = `WodaX 项目构建工具`;
  const startTime = traceStartCommand(cmdDescription);
  allSubProjectDirs.forEach(perPrjPath => {
    mainProjectWorkDir = perPrjPath;
    run();
  });
  traceEndCommand(cmdDescription, startTime);
} catch (e) {
  console.error(e);
  process.exit(1);
}


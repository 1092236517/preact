const util = require('util');
const fs = require('fs');
const path = require('path');
const updateNotifier = require('wodax-update-notifier');

const leftToken = '\033[1;31m';
const rightToken = '\033[0;0m';

/**
 * 异步运行 spawn 子进程
 * @param command
 * @param args
 * @param options
 * @param onExitCallback
 */
function runSpawnProcess(
  command = '',
  args = [],
  options = {},
  onExitCallback = () => {
  }
) {
  try {
    const envData = {
      ...process.env,
      NODE_OPTIONS: '--max_old_space_size=4096',
    };

    const hl = require('child_process').spawn(command, args, {
      env: envData,
      ...options,
    });
    hl.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    hl.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    hl.on('exit', (code, signal) => {
      onExitCallback && onExitCallback(code, signal);
    });
  } catch (e) {
    console.error(e);
    onExitCallback(-1, '');
  }
}

/**
 * 运行同步命令
 * @param command  命令
 * @param enableOutputContent 是否可以输出内容
 * @param enableThrow  是否可以抛出异常
 */
function runOneCommand({
                         command = `pwd`,
                         enableOutputContent = false,
                         enableThrow = false,
                       }) {
  try {
    const output = require('child_process').execSync(`${command}`, {
      env: {
        ...process.env,
        NODE_OPTIONS: '--max_old_space_size=4096',
      },
    });
    if (enableOutputContent) {
      console.log(output.toString());
    }
  } catch (e) {
    if (enableThrow) throw e;
  }
}

/** check Current Project Packages
 *
 * @param pkgInfo
 */
function checkCurrentProjectPackage(pkgInfo) {
  try {
    const {name: packageName, version: packageVersion, wodax} = pkgInfo;
    const {templateClassId, templateKey, templateVersion} = wodax;
    const pkg = {
      name: packageName,
      version: packageVersion,
    };

    // check templateVersion
    updateNotifier({
      pkg,
      templateClassId,
      templateKey,
      templateVersion,
      updateCheckInterval: 0,
      callback: function (err, info) {
        if (err) {
          if (!pkg.name === packageName) {
            console.error(err);
          }
        } else {
          console.log(info);
        }
      },
    });

    // check Dependencies
    [
      'devDependencies',
      'optionalDependencies',
      'dependencies',
      'peerDependency',
      'bundleDependencies',
    ].map((ele) => {
      const dependencies = pkgInfo[ele] || {};
      Object.keys(dependencies).map((one_pkg_name) => {
        const pkg = {
          name: one_pkg_name,
          version: dependencies[one_pkg_name],
          dependenciesType: ele,
        };

        const notifier = updateNotifier({
          pkg,
          templateClassId,
          templateKey,
          updateCheckInterval: 0,
          callback: function (err, info) {
            if (err) {
              if (!pkg.name === packageName) {
                console.error(err);
              }
            } else {
              const packageName = this.packageName;
              // 1. 先检测包是否存在？
              const modulePath = `${path.normalize(
                path.join(__dirname, '../node_modules', packageName)
              )}`;
              if (!fs.existsSync(`${modulePath}`)) {
                try {
                  const installCommand = this.getInstallCommand({
                    latestVersion: pkg.version,
                    isYarnGlobal: false,
                    isGlobal: false,
                  });

                  console.log(`${leftToken}${'-'.repeat(36)}${rightToken}`);
                  console.log(`检测路径为：'${modulePath}'`);
                  console.log(
                    `根据 WodaX 项目架构规范要求，'${packageName}' 依赖包没有找到，正在启动安装程序 ...`
                  );
                  console.log(
                    `如果 '${packageName}' 更新失败，请在终端中手动运行该命令 '${installCommand}'`
                  );
                  console.log(`${leftToken}${'-'.repeat(36)}${rightToken}`);
                  runOneCommand({
                    command: `${installCommand}`,
                    enableOutputContent: false,
                    enableThrow: true,
                  });
                  console.log(`核心依赖 '${packageName}' 已安装完成 ... `);
                  console.log(`${leftToken}${'-'.repeat(36)}${rightToken}`);
                } catch (e) {
                  console.error(e);
                }
              } else {
                // 2. 再检测是否需要更新
                const {type} = info;
                if (type && type !== 'latest') {
                  this.config.set('update', info);
                  this.printInfo(info);
                }
              }
            }
          },
        });
      });
    });
  } catch (e) {
  }
}

function run(cb) {
  // 检测 npm config list
  const enableCheckNPMConfig = false;
  if (enableCheckNPMConfig) {
    console.log(
      `${leftToken}正在检测 npm config 配置 (nodejs 全局globle 缓存cache 需要特别注意)...  ${rightToken}`
    );
    runOneCommand({command: `npm config list`, enableOutputContent: true});
    console.log(`${leftToken}${'-'.repeat(36)}${rightToken}`);
  }

  // 启动自检处理
  updateNotifier.selfCheckUpdate((err, info) => {
    if (!err) {
      const {packageName, needUpdate, installCommand} = info;
      if (!needUpdate) {
        // check Dependencies
        const pkgInfo = require('../package.json');
        checkCurrentProjectPackage(pkgInfo);
        cb && cb();
      } else {
        console.log(
          `根据 WodaX 项目架构规范要求，'${packageName}' 正在强制更新中 ...`
        );
        console.log(
          `如果 '${packageName}'更新失败，请在终端中手动运行该命令 '${installCommand}' ...`
        );

        try {
          runOneCommand({command: `${installCommand}`, enableThrow: true});
          console.log(
            `${leftToken} 核心依赖 '${packageName}' 已更新完成。 正在重新检查 ... ${rightToken}`
          );
          runSpawnProcess(process.execPath, [__filename], {});
        } catch (e) {
          console.error(e);
          process.exit(999);
        }
      }
    }
  });
}

function main() {
  console.log(`${leftToken}${'>'.repeat(36)}${rightToken}`);
  run(()=> {
    console.log(`${leftToken}${'<'.repeat(36)}${rightToken}`);
  });
}

main();

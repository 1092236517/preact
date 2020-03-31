/**
 * @description 导出全局变量，可以是从以下三种方式获得：
 *  - .env 环境变量
 *  - webpack define 变量
 *  - 计算值或固定值
 *
 * 主要起到统一应用，统一管理的作用。
 *
 * @example
 * export default {
 *   WODAX_APP_NAME: process.env.WODAX_APP_NAME || 'WODAX_APP_NAME',
 *   Version: '1.0.0'
 * }
 *
 */

const $ = process_wodax_env;

const getALIYUNENV = () => {
  // 根据环境变量，获取
  console.warn(
    `TODO: 请根据自己的实际项目来检查及配置 __ALIYUN_ENV__ 环境变量值 ---from src/defines/global`
  );

  // 示例1： 根据运维线上构建环境及Git分支的匹配关系
  const buildEnv2ALIYUNENV = {
    alpha: 'test',
    sit: 'test',
    uat: 'test',
    production: 'production',
  };
  return buildEnv2ALIYUNENV[$.WODAX_BUILD_ENV || 'alpha'];

  // 示例2：

  // 示例3：
};

const getMockHost = () => {
  const node_env = $.NODE_ENV || 'development';
  const cfg = {
    development: {
      alpha: '',
      sit: '',
      uat: '',
      production: ''
    },
    production: {
      alpha: '',
      sit: '',
      uat: '',
      production: ''
    }
  };

  let mockHost = '';
  try {
    mockHost = cfg[node_env]['alpha']
  }catch(e){}
  return mockHost
};


/* eslint no-undef: "off" */
const env = {
  // #region NODE 配置
  NODE_ENV: $.NODE_ENV,
  // #endregion


  // #region UMI 配置

  // #endregion

  // #region WodaX 构建相关
  WODAX_BUILD_APPLICATION_NAME: $.WODAX_BUILD_APPLICATION_NAME || '',
  WODAX_BUILD_APPLICATION_VERSION: $.WODAX_BUILD_APPLICATION_VERSION || '',
  WODAX_BUILD_ENV: $.WODAX_BUILD_ENV || '',
  WODAX_BUILD_DATETIME: $.WODAX_BUILD_DATETIME || '',
  WODAX_BUILD_GIT_URL: $.WODAX_BUILD_GIT_URL || '',
  WODAX_BUILD_GIT_BRANCH: $.WODAX_BUILD_GIT_BRANCH || '',
  WODAX_BUILD_GIT_COMMIT_ID: $.WODAX_BUILD_GIT_COMMIT_ID || '',
  // #endregion

  // #region Wodax 全局配置
  WODAX_APP_NAME: $.WODAX_APP_NAME || '',
  WODAX_APP_VERSION: $.WODAX_APP_VERSION || '',
  // #endregion

  // #region 第三方依赖
  __ALIYUN_ENV__: getALIYUNENV(),
  // #endregion

  // #region 本项目专属
  APP_TYPE: $.APP_TYPE || 'APP_TYPE',
  APP_API_HOST: getMockHost(),
  // #endregion
};

try {
  // @ts-ignore
  window.WODAX = window.WODAX || {};
  // @ts-ignore
  window.WODAX.env = env;
  // eslint-disable-next-line no-empty
} catch (e) {}

export default env;


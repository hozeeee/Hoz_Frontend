import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

/**
  appInfo 的属性有:
    pkg	    package.json
    name	  应用名，同 pkg.name
    baseDir	应用代码的目录
    HOME	  用户目录，如 admin 账户为 /home/admin
    root	  应用根目录，只有在 local 和 unittest 环境下为 baseDir，其他都为 HOME。
 */
export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1600762922076_5900';


  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  config.middleware = ['gzip'];
  // 配置 gzip 中间件的配置
  config.gzip = {
    threshold: 1024, // 小于 1k 的响应体不压缩
  }

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};

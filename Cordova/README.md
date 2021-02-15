
# Cordova

Apache Cordova 是一个开放源代码的移动开发框架。它允许您使用标准的 Web 技术(HTML5, CSS3, JavaScript) 进行跨平台开发。

Cordova 框架图：

![cordova框架](./图片/cordova框架.png)

[**平台支持情况**](https://cordova.apache.org/docs/en/latest/guide/support/index.html#core-plugin-apis) 。

[**Cordova 命令**](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html) 。

[**`config.xml` 配置**](https://cordova.apache.org/docs/en/latest/config_ref/index.html) 。

[Cordova Hooks](https://cordova.apache.org/docs/en/latest/guide/appdev/hooks/index.html) 可以添加**钩子函数**。

</br>

## 项目目录结构

``` txt
my_cordova_app
├─ platforms
│  └─ ...
├─ plugins
│  └─ ...
├─ node_modules
│  └─ ...
├─ www
│  └─ ...
├─ package.json
├─ config.xml
```

默认情况下， `platforms` 和 `plugins` 是不会被提交到代码仓库的，因为它们是根据 `package.json` 的 `cordova` 属性创建的。当然了，新安装的插件和平台，都会在 `package.json` 添加。

`package.json` 下，除了 `cordova` 属性，基本与其他的 nodejs 项目一样。

`node_modules` 就不必多说了。

[**`config.xml`**](https://cordova.apache.org/docs/en/latest/config_ref/index.html) 是用于描述 APP 相关的信息，例如，可访问的域名、HTML入口文件、APP的图标、APP的名称等等信息。

`www` 目录下，则是存放打包后的页面静态文件，如，HTML、JavaScript、css等。

除了上面介绍的，还可以创建一个文件夹，用于存放前端的工程文件，打包后再放到 `www` 目录下。

</br>

## 安装&准备

下面以 Windows 系统开发 Android 平台的安装，其他平台请查阅[官网文档](https://cordova.apache.org/docs/en/latest/guide/support/index.html)说明。

1. `npm install -g cordova` 全局**安装** Cordova 。

2. 安装 Java Development Kit (JDK) 8 。

3. 设置 `JAVA_HOME` 环境变量，如 `C:\Program Files\Java\jdk1.8.0_251` 。

4. 安装 Android Studio 。

5. 在 Android Studio 中添加 SDK 包。
    - 打开 Android SDK Manager 面板。
    - 安装目标 Android 版本的 Android Platform SDK 。
    - Android SDK build-tools 版本升级到 19.1.0 或者以上。
    - 安装 Android Support Repository (在"Extras"查找)。

6. 设置 `ANDROID_HOME` 环境变量，如 `C:\Users\hoz\AppData\Local\Android\Sdk` 。

7. 添加 Android SDK 的 tools 和 platform-tools 目录到你的 PATH 。

8. 自 cordova-android@4.0.0 起，需要安装 Gradle ，[下载地址1](https://gradle.org/releases/)、[下载地址2](https://services.gradle.org/distributions/)。

9. 将 Gradle 解压后配置到你的 PATH ，如 `C:\Program Files\gradle-6.6\bin` 。

10. 建议修改 Gradle 的全局镜像仓库，在 `USER_HOME/.gradle/` 下创建 `init.gradle` 文件：

    ``` gradle
    allprojects{
      repositories {
        def ALIYUN_REPOSITORY_URL = 'http://maven.aliyun.com/nexus/content/groups/public'
        def ALIYUN_JCENTER_URL = 'http://maven.aliyun.com/nexus/content/repositories/jcenter'
        all { ArtifactRepository repo ->
          if(repo instanceof MavenArtifactRepository){
            def url = repo.url.toString()
            if (url.startsWith('https://repo1.maven.org/maven2')) {
              project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_REPOSITORY_URL."
              remove repo
            }
            if (url.startsWith('https://jcenter.bintray.com/')) {
              project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_JCENTER_URL."
              remove repo
            }
          }
        }
        maven {
          url ALIYUN_REPOSITORY_URL
          url ALIYUN_JCENTER_URL
        }
      }
    }
    ```

11. 若上面步骤你都已经在很久已经部署好了，但需要**升级**版本。
    - 升级 Cordova ： `npm update -g cordova` 。
    - 覆盖安装特定版本的 Cordova ： `npm install -g cordova@3.1.0-0.2.0` 。
    - 升级平台(以安卓为例)： `cordova platform update android --save` 。

</br>

## 创建项目

1. **新建**项目：

    最简单的方式是，使用命令 `cordova create <program-name>` 创建项目。

    除了上面这种方式， Cordova 还提供"模板"的方式创建项目。模板可以由个人创建。命令如下：

    ``` shell
    cordova create hello com.example.hello HelloWorld --template <npm-package-name>
    cordova create hello com.example.hello HelloWorld --template <git-remote-url>
    cordova create hello com.example.hello HelloWorld --template <path-to-template>
    ```

    如果需要查询可用"模板"，可以到 [npm官网](https://www.npmjs.com/) 搜索 `cordova:template` 关键字。

    如果需要创建属于自己的模板，并且分享给他人，可以参考 [官方模板](https://github.com/apache/cordova-app-hello-world) ，[官方文档](https://cordova.apache.org/docs/en/latest/guide/cli/template.html#create-a-template) 也有大概说明。

2. 添加**平台**：

    完整命令是 `cordova platform add <platform[@<version>] | directory | git_url>` 。

    点击查看 [平台相关命令](https://cordova.apache.org/docs/en/latest/platform_plugin_versioning_ref/index.html#platform-versioning) 的详细介绍。

    例如，运行 `cordova platform add android` **添加**安卓**平台**，其他平台的开发同理。

    在项目的根目录下的 `package.json` 的 `cordova.platforms` 可以查看已添加的平台。

    如果想了解支持的平台，运行 `cordova platform ls` 。

3. 添加**插件**：

    完整命令是 `cordova plugin add <plugin[@<version>] | directory | git_url>` 。

    点击查看 [插件相关命令](https://cordova.apache.org/docs/en/latest/platform_plugin_versioning_ref/index.html#plugin-versioning) 的详细介绍。

    例如，需要使用到设备的相机，运行 `cordova plugin add cordova-plugin-camera` 。

    如果不清楚插件名，可以到 [插件搜索页](https://cordova.apache.org/plugins/) **搜索**；

    也可以在命令行运行 `cordova plugin search <pluginName>` **搜索**相关插件。

    在项目的根目录下的 `package.json` 的 `cordova.plugins` 可以查看已添加的插件。

    运行 `cordova plugin ls` 可**查看**项目**已添加插件**的列表。

4. 设置**应用图标**：

    主要是通过项目根目录下的 **`config.xml`** 文件中的 `<icon src="res/ios/icon.png" platform="ios" width="57" height="57" density="mdpi" />` 标签指定图标。

    除了 `src` 属性，其他都是可选参数。

    `<icon>` 用于"根标签下"，表示作为默认图标；它还能放在 `<platform>` 标签内，表示对特定平台设置图标。

    它可以根据平台的不同，分辨率的不同，配置不同的图标，具体不列举，详细介绍看 [官网](https://cordova.apache.org/docs/en/latest/config_ref/images.html) 。

5. 设置**启动画面**（可选）：

    这部分功能通过使用 `cordova-plugin-splashscreen` 插件完成。

    具体使用看 [文档](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/) 介绍。

</br>

## 数据存储

### WebView 提供的

由于 Cordova 是基于 WebView 实现，所以浏览器能用的那几种存储方式（如，localStorage、sessionStorage、cookie、IndexedDB），在 Cordova 应用中也能使用。

需要注意几点：

- IOS 可能会在空间不足的情况下清理 WebView 中 localStorage 的数据。
- Windows 对 IndexedDB 的支持不完整。例如：
  - 在 WebWorker 中不可用。
  - 不支持"数组路径"（如 `arr[0]` ）。
  - 不支持数组键。
  - 不支持通过复合索引进行对象查找。

### WebSQL (不推荐使用)

WebSQL 提供了一个用于在结构化数据库中存储数据的 API ，可以使用标准SQL语法（特别是 SQLite ）进行查询。

创建或打开数据库的入口点是 `window.openDatabase()` 方法：

``` js
var db = window.openDatabase(name, version, displayName, estimatedSize);
```

- `name`(string): 数据库的唯一名称，因为它将存储在磁盘中。
- `version`(string): 数据库的版本。
- `displayName`(string): 数据库的人性化名称，系统在需要向用户描述您的数据库时（例如，在请求允许增加数据库大小的情况下）将使用该名称。
- `estimatedSize`(number): 数据库的预期最大大小，以字节为单位。随着数据库大小的增加，可能会提示用户权限。如果您做出合理的初步猜测，则可能会较少地提示用户。

它还提供了事务：

``` js
var db = window.openDatabase(name, version, displayName, estimatedSize);
// 还有 readTransaction() 只读事务
db.transaction(function (tx) {
  tx.executeSql(sqlStatement, valueArray, function (tx, result) {
    console.log(result);
  }, function (error) {
    console.log(error);
  });
});
```

需要注意：

- 并非所有 Cordova 平台都支持。
- **该 API 已弃用**。
- 总存储空间有限（通常约为5MB）。

### 由插件提供

[`cordova-plugin-file`](https://github.com/apache/cordova-plugin-file/blob/master/README.md) 提供了用于在本地文件系统上存储和检索数据的 API 。

SQLite 相关的插件：

- [`cordova-sqlite-storage`](https://github.com/storesafe/cordova-sqlite-storage#readme): 包含自己的 sqlite3 实现的核心版本。它支持 iOS, Android & Windows 平台。
- [`cordova-sqlite-ext`](https://github.com/brodybits/cordova-sqlite-ext#readme): 具有附加功能的扩展版本，包括对 Android 和 iOS 上的 REGEXP 支持。
- [`cordova-sqlite-evfree`](https://github.com/litehelpers/cordova-sqlite-evplus-ext-legacy-build-free#readme): 与 `cordova-sqlite-ext` 类似，但是改进了内存处理。在 GPL v3 或商业许可下可用。
- ....

</br>

## 事件监听

熟悉前端开发的都知道，添加监听器使用 `document.addEventListener()` 方法。即：

``` js
document.addEventListener(eventName, listener);
```

Cordova 的 WebView 为页面提供了额外的事件。

1. `deviceready`:
    - 当 Cordova 加载完成时会触发该事件。
    - 它表明 Cordova 的设备的 API 已加载并可以访问。

2. `pause`:
    - 本应用程序置于后台时（通常在用户切换到其他应用程序时），将触发该事件。

3. `resume`:
    - 本应用程序从后台被拉出时，触发该事件。

4. `backbutton`:
    - 用户按下 "后退" 按钮时，触发该事件。
    - 如果需要覆盖该按钮行为，可以添加监听器，然后阻止默认事件的触发。

5. `menubutton`:
    - 用户按下 "菜单" 按钮时，触发该事件。

6. `searchbutton`:
    - 用户按下 "搜索" 按钮时，触发该事件。

7. `startcallbutton`:
    - 用户按下 "接听" 按钮时，触发该事件。

8. `endcallbutton`
    - 用户按下 "挂断" 按钮时，触发该事件。

9. `volumeupbutton`:
    - 用户按下 "音量键上" 按钮时，触发该事件。

10. `volumedownbutton`:
    - 用户按下 "音量键下" 按钮时，触发该事件。

11. `activated`:
    - 激活 Windows 运行时，触发该事件。

[官方文档](https://cordova.apache.org/docs/en/latest/cordova/events/events.html) 。

</br>

## 安全

**`iframe`** 有权访问本机 Cordova 桥。但 iOS 例外，因为iOS会拦截所有内容，包括 `iframe` 连接。

不建议在服务器上使用**自签名证书**，因为自签名证书会绕过本机证书链验证，可能会遭受"中间人攻击"。建议使用知名机构颁发的证书。

**`InAppBrowser`** 用于打开指向任何外部网站的链接，它不受"域白名单"影响，也不会有访问您的 Cordova 环境的能力。

尽量不要使用 **`eval()`** ，原因不用多介绍了。

不要以为您的源代码是安全的，因为 Cordova 应用程序是使用 HTML 和 JavaScript 资源构建的，这些资源都打包在本机容器中，可能会被进行反向工程获取源代码。

域的**白名单**：

- 在项目根目录下的 `config.xml` 文件中，通过 `<access>` 标签可以配置能访问的域。
- 默认情况下，只使用 `config.xml` 的配置即可。若有特殊的安全策略，请使用 [`cordova-plugin-whitelist`](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist/) 插件。

</br>

## 常见问题汇总

1. 执行 `cordova run android` 停留在 **`Waiting for emulator to start...`** ：
    - 方法一：电脑用 USB 连接手机，手机开启 USB 调试模式；再运行启动命令。
    - 方法二：用 Android Studio 开启 AVD 管理器，启动虚拟机；待虚拟机启动完成后，再运行启动命令。

2. 执行 `cordova run android` 会下载 **Gradle** ，可能会因为网络问题，导致下载失败或者下载缓慢：
    - 先到 [下载地址1](https://gradle.org/releases/) 或 [下载地址2](https://services.gradle.org/distributions/) 下载 Gradle ；
    - 把压缩包放到项目的 `cordova_demo/platforms/android/gradle/wrapper/` 目录下，其中 "cordova_demo" 是项目根目录；
    - 用编辑器打开 `cordova_demo/platforms/android/cordova/lib/builders/ProjectBuilder.js` 文件；
    - 将 `const distributionUrl = process.env.CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL || ....;` 中 `||` 后面的路径改为 `'gradle-6.5-all.zip'` ；
    - 即完整代码是 `const distributionUrl = process.env.CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL || 'gradle-6.5-all.zip';` 。

3. 被 Cordova 使用的 HTML 只是本地打开的文件，后端需要配置 **CORS** 跨域访问。
    - 例如，调用拍照插件，如果获取的只是 URI ，是无法把资源发送给后端。需要让插件返回 base64 的字符串。

4. 插件可能只会提供 **`exec(<successFunction>, <failFunction>, <service>, <action>, [<args>]);`** 的访问方式。
    - 接口封装了了从 WebView 到 Android 本机端的请求。
    - 调用 `service` 类上 `action` 的方法，并在 `args` 数组中传递参数；
    - `successFunction` 和 `failFunction` 分别是成功和失败的回调函数。

5. 调试技巧：
    - 首先 `cordova run android` 启动应用。
    - 然后在 Chrome 浏览器地址栏输入 `chrome://inspect/` ，选择对应的页面，点击 `inspect` 。需要注意的是，首次使用需要开启翻墙。

</br>

## 创建自己的插件

略。

[相关资料1](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/index.html)

[相关资料2](https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html)

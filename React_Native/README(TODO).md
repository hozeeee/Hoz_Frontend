
# 环境搭建

这里只是简单介绍 Windows 下开发 Android 应用，其他平台或者开发 iOS 的，请查阅[官方文档](https://reactnative.cn/docs/getting-started.html)。

1. 安装依赖：

    建议直接使用搜索引擎搜索下载 Node(版本>=12) 、Python2 和 [Java SE Development Kit (JDK) (必须1.8)](www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 。

2. 使用淘宝镜像：

    注意：不要使用 cnpm！cnpm 安装的模块路径比较奇怪，packager 不能正常识别！

    ``` shell
    # 使用 nrm 工具切换淘宝源
    npx nrm use taobao

    # 如果之后需要切换回官方源可使用
    npx nrm use npm
    ```

3. 安装 Android Studio ：

    首先下载和安装 [Android Studio](https://developer.android.com/studio/index.html) ，国内用户可能无法打开官方链接，请自行使用搜索引擎搜索可用的下载链接。安装界面中选择 "Custom" 选项，确保选中了以下几项：(如果选择框是灰的，你也可以先跳过，稍后再来安装这些组件)
      - Android SDK
      - Android SDK Platform
      - Performance (Intel ® HAXM) ([AMD 处理器看这里](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html))
      - Android Virtual Device

4. 安装 Android SDK ：

    在 Android Studio 的欢迎界面中找到 SDK Manager 。点击 "Configure" ，然后就能看到 "SDK Manager" 。

    在 SDK Manager 中选择 "SDK Platforms" 选项卡，然后在右下角勾选 "Show Package Details" 。展开 Android 9 (Pie) 选项，确保勾选了下面这些组件（重申你必须使用稳定的翻墙工具，否则可能都看不到这个界面）：
      - Android SDK Platform 28
      - Intel x86 Atom_64 System Image（官方模拟器镜像文件，使用非官方模拟器不需要安装此组件）

    然后点击 "SDK Tools" 选项卡，同样勾中右下角的 "Show Package Details" 。展开 "Android SDK Build-Tools" 选项，确保选中了 React Native 所必须的 28.0.3 版本。你可以同时安装多个其他版本。

    最后点击 "Apply" 来下载和安装这些组件。

5. 配置 ANDROID_HOME 环境变量：

    创建一个名为ANDROID_HOME的环境变量，指向你的 Android SDK 所在的目录。

    SDK 默认是安装目录： `c:\Users\你的用户名\AppData\Local\Android\Sdk`

6. 把一些工具目录添加到**环境变量 Path** 中：

    ``` txt
    %ANDROID_HOME%\platform-tools
    %ANDROID_HOME%\emulator
    %ANDROID_HOME%\tools
    %ANDROID_HOME%\tools\bin
    ```

7. 注意，如果使用 AMD CPU 不能直接创建 AVD ，需要满足如下条件：

    - 推荐： AMD Ryzen 处理器
    - Android Studio 3.2 Beta 或更高版本
    - Android Emulator v27.3.8+ (通过 Android Studio SDK Manager 下载)
    - Windows 10 (2018年4月更新)
    - 通过 Windows 功能启用： "Windows Hypervisor Platform"
      1. 快捷键 win + R
      2. 输入 `optionalfeatures` 打开 "Windows 功能" 面板
      3. 勾选 "Windows Hypervisor Platform" 选项

8. 创建新项目：

    注意：请不要单独使用常见的关键字作为项目名（如 class, native, new, package 等等）。请不要使用与核心模块同名的项目名（如 react, react-native 等）。请不要在目录、文件名中使用中文、空格等特殊符号。

    ``` shell
    # 创建项目
    npx react-native init AwesomeProject
    # 带有 --version 参数可以创建指定版本的项目
    npx react-native init MyApp --version 0.44.3
    ```

9. 启动项目：

    到工程目录下运行

    ``` shell
    # 安装依赖
    npm install
    # 运行项目
    npx react-native run-android
    ```

    首次运行会自动下载 gradle ，期间如果中断，需要到 `C:\Users\你的用户名\.gradle\wrapper\dists` 目录下，把整个 gradle 目录删掉，然后再重新运行项目。

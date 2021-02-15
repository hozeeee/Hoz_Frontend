
# MIME 定义

**媒体类型**（通常称为 **Multipurpose Internet Mail Extensions** 或 **MIME** 类型 ）是一种标准，用来表示文档、文件或字节流的性质和格式。它在 IETF RFC 6838 中进行了定义和标准化。

</br>

# MIME 通用结构

**`type/subtype;parameter`** 。由类型与子类型两个字符串中间用 `'/'` 分隔而组成。不允许空格存在。**`type`** 表示可以被分多个子类的**独立类型**。**`subtype`** 表示细分后的每个类型。**对大小写不敏感**，但是传统写法都是小写。**`parameter`** 是可选参数，如 `charset`，`boundary` 等。

</br>

# 可选参数(`parameter`)



</br>

# 独立类型(`type`)

独立类型表明了对文件的分类，可以是如下之一：

|    类型     |                                 描述                                 |                   示例                   |
|:-----------:|:--------------------------------------------------------------------:|:----------------------------------------:|
|    text     |                 表明文件是普通文本，理论上是人类可读                 |                text/plain                |
|    image    | 表明是某种图像。不包括视频，但是动态图（比如动态gif）也使用image类型 |                image/png                 |
|    audio    |                          表明是某种音频文件                          |                audio/mpeg                |
|    video    |                          表明是某种视频文件                          |          video/webm, video/ogg           |
| application |                         表明是某种二进制数据                         |         application/octet-stream         |
|  multipart  |                        复合文件的一种表现方式                        | multipart/form-data multipart/byteranges |
|             |                                                                      |                                          |

</br>

# 常见的 MIME 类型

|   文件格式   |                                   对应 MIMEType 类型                                   |
|:------------:|:--------------------------------------------------------------------------------------:|
|     .png     |                                       image/png                                        |
| .jpeg 或.jpg |                                       image/jpeg                                       |
|     .gif     |                                       image/gif                                        |
|    .webp     |                                       image/webp                                       |
|     .xls     |                                application/vnd.ms-excel                                |
|    .xlsx     |           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet            |
|     .doc     |                                   application/msword                                   |
|    .docx     |        application/vnd.openxmlformats-officedocument.wordprocessingml.document         |
|     .ppt     |                             application/vnd.ms-powerpoint                              |
|    .pptx     |       application/vnd.openxmlformats-officedocument.presentationml.presentation        |
|     .wps     |                                application/vnd.ms-works                                |
|     .pdf     |                                    application/pdf                                     |
|     .txt     |                                       text/plain                                       |
|     .htm     |                                       text/html                                        |
|    .html     |                                       text/html                                        |
|     .ico     |                                      image/x-icon                                      |
|     .chm     |                application/vnd.ms-htmlhelp 或 application/octet-stream                 |
|     .js      |                    application/javascript 或 application/ecmascript                    |
|     .svg     |                                     image/svg+xml                                      |
|              |                                                                                        |
|              |                                                                                        |
|     JSON     |                                  **application/json**                                  |
|   普通文本   |                                     **text/plain**                                     |
|   FormData   | **application/x-www-form-urlencoded** (不带文件) 或 **multipart/form-data** (带有文件) |
|  HTML 文档   |                                      **text/xml**                                      |
|              |                                                                                        |
|              |                                                                                        |
|              |                                                                                        |
|              |                                                                                        |
|              |                                                                                        |
|              |                                                                                        |
|              |                                                                                        |
|              |                                                                                        |

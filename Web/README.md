# 基于 Web 通过 WHIP 接入 QRTC 网络

通过浏览器可以直接将浏览器的采集信息使用 WHIP 的方式推送到 QRTC 网络，是一种非常轻量化的接入方式。

## 快速构建 WHIP 验证环境

### Step 1 创建 七牛云-实时音视频 应用

参考 [https://developer.qiniu.com/rtc/10155/process](https://developer.qiniu.com/rtc/10155/process)

### Step 2 获取 Token

参考 [https://developer.qiniu.com/rtc/8813/roomToken](https://developer.qiniu.com/rtc/8813/roomToken)

### Step 3 通过 whip-client web demo 推流

访问： [https://qrtc.github.io/whip-client/Web/demo/whip.html](https://qrtc.github.io/whip-client/Web/demo/whip.html)

其中：

- <APP_ID> // 为 Step 1 中创建的 APP_ID
- <ROOM_ID> // 为房间名称
- <USER_ID> // 为房间内用户名称
- <ROOM_TOKEN> // 为 Step 2 中签算的 Token

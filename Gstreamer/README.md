# 基于 Gstreamer 通过 WHIP 接入 QRTC 网络

对于只进行推流并且体量较轻的设备，使用基于 Gstreamer 的方式通过 WHIP 协议向 QRTC 网络推流是一种比较好的方式。

## 快速构建 WHIP 验证环境

### Step 1 创建 七牛云-实时音视频 应用

参考 [https://developer.qiniu.com/rtc/10155/process](https://developer.qiniu.com/rtc/10155/process)

### Step 2 获取 Token

参考 [https://developer.qiniu.com/rtc/8813/roomToken](https://developer.qiniu.com/rtc/8813/roomToken)

### Step 3 通过 simple-whip-client 推流

编译或安装 simple-whip-client

- 通过编译方式：参考 [https://github.com/meetecho/simple-whip-client](https://github.com/meetecho/simple-whip-client)；
- 通过安装方式：Ubuntu22.04 及以上版本中已经包含了 simple-whip-client，使用 `apt install simple-whip-client` 即可完成安装；

运行

```shell
export WHIP_TOKEN="<ROOM_TOKEN>"

whip-client -n -u https://rtc.qiniuapi.com/v3/apps/<APP_ID>/rooms/<ROOM_ID>/users/<USER_ID>/publish \
    -t ${WHIP_TOKEN} \
    -A "audiotestsrc is-live=true wave=red-noise ! audioconvert ! audioresample ! queue ! opusenc inband-fec=true ! rtpopuspay pt=111 ssrc=1 ! queue ! application/x-rtp,media=audio,encoding-name=OPUS,payload=111" \
    -V "videotestsrc is-live=true pattern=ball ! videoconvert ! queue ! x264enc b-adapt=false ! rtph264pay pt=125 ssrc=2 ! queue ! application/x-rtp,media=video,encoding-name=H264,payload=125"

```

其中：

- <APP_ID> // 为 Step 1 中创建的 APP_ID
- <ROOM_ID> // 为房间名称
- <USER_ID> // 为房间内用户名称
- <ROOM_TOKEN> // 为 Step 2 中签算的 Token

以上命令运行成功后即可在对应的房间内订阅到已推流成功的音视频。

## 集成

- 上面示例中使用的 `audiotestsrc` 和 `videotestsrc` 均为测试音视频源，具体业务中可以将音视频源修改为 Gstreamer 支持的输入源，例如 RTSP，Camera，Microphone 等；
- simple-whip-client 遵循 GPL 开源协议，可以参考其实现方式，将推流逻辑集成到具体应用的业务逻辑中；

## 参考文档

- [https://github.com/meetecho/simple-whip-client](https://github.com/meetecho/simple-whip-client)

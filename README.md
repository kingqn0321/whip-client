# 通过 WHIP 接入 QRTC 网络

## WHIP 介绍

WebRTC 在实时互动的场景中得到了广泛的应用，但是 WebRTC 没有定义 Offer/Answer 模型的载体 SDP 具体使用什么协议进行交换，这使得将 WebRTC 做为接入协议时往往依赖所接入平台的 SDK，提高了接入门槛。目前还没有为使用 WebRTC 将媒体导入流媒体服务而设计的标准协议，WHIP 便是为了解决这个问题而设计。

WebRTC-HTTP Ingest Protocol (WHIP) 使用 HTTP POST 请求执行单次 SDP Offer/Answer，以便在编码器/媒体生产者(WHIP 客户端)和广播接收端点(媒体服务器)之间建立 ICE/DTLS 会话。

一旦 ICE/DTLS 会话建立，媒体将从编码器/媒体生成器(WHIP客户端)单向流向广播接收端点(媒体服务器)。为了降低复杂性，不支持 SDP 重新协商，因此在完成通过 HTTP 的初始 SDP Offer/Answer 后，不能添加或删除任何 track 或 stream 。

WHIP 是以 WebRTC 作为媒体接入方法的简单协议:

- 容易实现；
- 像流行的基于 IP 的广播协议一样容易使用；
- 完全符合 WebRTC 和 RTCWEB 规范；
- 允许在传统媒体平台和 WebRTC 端到端平台以尽可能低的延迟接入；
- 降低对硬件编码器和广播服务的要求，以支持 WebRTC；
- 可在 web 浏览器和本机编码器中使用；

## WHIP 接入方式

- [Web](https://github.com/qrtc/whip-client/tree/main/Web)
- [Gstreamer](https://github.com/qrtc/whip-client/tree/main/Gstreamer)
- [OBS](https://github.com/qrtc/whip-client/tree/main/OBS)

## 参考文档

- [WebRTC-HTTP ingestion protocol (WHIP) (ietf.org)](https://datatracker.ietf.org/doc/draft-ietf-wish-whip/)
- [WHIP-ing WebRTC to Janus! | Meetecho Blog](https://www.meetecho.com/blog/whip-janus/)
- [WISH, WHIP and Janus: Part II | Meetecho Blog](https://www.meetecho.com/blog/whip-janus-part-ii/)
- [WHIP, WHEP, WHAP! | Meetecho Blog](https://www.meetecho.com/blog/whip-whep/)

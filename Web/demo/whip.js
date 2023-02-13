'use strict';

// WHIP
const pubVideoVideo = document.querySelector('#pubVideo');
const pubAudioCanvas = document.querySelector('#pubAudio');
const whipUrlTextarea = document.querySelector('#whipUrl');
const whipTokenTextarea = document.querySelector('#whipToken');
const whipStartButton = document.querySelector('#whipStart');
const whipStopButton = document.querySelector('#whipStop');

// Global Variable
var whipClient = null;

// Initialize
window.onload = () => {
  whipUrlTextarea.value = 'https://rtc.qiniuapi.com/v3/apps/<APP_ID>/rooms/<ROOM_ID>/users/<USER_ID>/publish';
  whipStartButton.addEventListener('click', whipStart);
  whipStopButton.addEventListener('click', whipStop);
}

class WHIPClient {
  constructor(endpoint, token, audioElement, videoElement) {
    this.endpoint = endpoint;
    this.token = token;
    this.audioElement = audioElement;
    this.videoElement = videoElement;

    this.peerConnection = new RTCPeerConnection({
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: "require",
      iceTransportPolicy: "all"
    });

    console.log('whip peer connection created.')

    this.peerConnection.addEventListener('negotiationneeded', async ev => {
      console.log('Connection negotiation starting');
      await negotiateConnectionWithClientOffer(this.peerConnection, this.endpoint, this.token);
      console.log('Connection negotiation ended');
    });

    this.accessLocalMediaSources().catch(console.error);
  }

  async accessLocalMediaSources() {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      stream.getTracks().forEach(track => {
        const transceiver = this.peerConnection.addTransceiver(track, {
          direction: 'sendonly',
        });
        if (!transceiver.sender.track) {
          return
        }
        let ms = new MediaStream([transceiver.sender.track]);
        switch (track.kind) {
          case 'audio':
            this.streamVisualizer = new StreamVisualizer(ms, this.audioElement);
            this.streamVisualizer.start();
            break;
          case 'video':
            transceiver.sender.track.applyConstraints({
              width: 1280,
              height: 720,
            });
            this.videoElement.srcObject = ms;
            break;
          default:
            break;
        }
      });
      return stream;
    });
  }

  async disconnectStream() {
    this.videoElement.srcObject = null;
    this.streamVisualizer.stop();
    this.streamVisualizer = null;

    var _a;
    const response = await fetch(this.endpoint, {
      method: 'DELETE',
      mode: 'cors',
    });
    this.peerConnection.close();
    (_a = this.localStream) === null || _a === void 0
      ? void 0
      : _a.getTracks().forEach(track => track.stop());
  }
}

// Performs the actual SDP exchange.
async function negotiateConnectionWithClientOffer(peerConnection, endpoint, token) {
  const offer = await peerConnection.createOffer();
  console.debug(`whip client offer sdp:\n%c${offer.sdp}`, 'color:cyan');
  await peerConnection.setLocalDescription(offer);
  while (peerConnection.connectionState !== 'closed') {
    let response = await postSDPOffer(endpoint, token, offer.sdp);
    if (response.status === 201) {
      let answerSDP = await response.text();
      console.debug(`whip client answer sdp:\n%c${answerSDP}`, 'color:cyan');
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: answerSDP })
      );
      return response.headers.get('Location');
    } else if (response.status === 405) {
      console.error('Update the URL passed into the WHIP or WHEP client');
    } else {
      const errorMessage = await response.text();
      console.error(errorMessage);
    }

    await new Promise(r => setTimeout(r, 5000));
  }
}

async function postSDPOffer(endpoint, token, data) {
  return await fetch(endpoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/sdp',
      'Authorization': 'Bearer ' + token,
    },
    body: data,
  });
}

function whipStart() {
  whipClient = new WHIPClient( whipUrlTextarea.value, whipTokenTextarea.value, pubAudioCanvas, pubVideoVideo);
}

function whipStop() {
  whipClient.disconnectStream();
}

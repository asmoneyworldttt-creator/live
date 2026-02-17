
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType, VideoEncoderConfiguration } from 'react-native-agora';
import { Platform, NativeModules } from 'react-native';

const APP_ID = process.env.AGORA_APP_ID || "temp_app_id";

class AgoraService {
    private engine: any = null;

    async init() {
        if (!this.engine) {
            // Correct initialization for v4
            this.engine = createAgoraRtcEngine();
            this.engine.initialize({ appId: APP_ID }); // Sometimes needed explicitly depending on pattern
        }

        this.engine.enableVideo();
        this.engine.enableAudio();

        // High quality video
        this.engine.setVideoEncoderConfiguration({
            dimensions: { width: 720, height: 1280 },
            frameRate: 30,
            bitrate: 1700,
            orientationMode: 0
        });

        // Disable hardware screenshot (security)
        if (Platform.OS === 'android') {
            NativeModules.AntiScreenshot?.enable();
        }
    }

    async joinCall(channelName: string, token: string, uid: number, isVideo: boolean) {
        if (!this.engine) await this.init();

        this.engine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
        this.engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

        if (!isVideo) {
            this.engine.disableVideo();
            this.engine.enableAudio();
        }

        this.engine.joinChannel(token, channelName, uid, {});
    }

    async leaveCall() {
        this.engine?.leaveChannel();
    }

    async toggleMic(muted: boolean) {
        this.engine?.muteLocalAudioStream(muted);
    }

    async toggleCamera(off: boolean) {
        this.engine?.muteLocalVideoStream(off);
    }

    async switchCamera() {
        this.engine?.switchCamera();
    }

    destroy() {
        this.engine?.release();
        this.engine = null;
    }
}

export const agoraService = new AgoraService();

declare module "timer" {
    import { FakeEventTarget } from '@playkit-js/playkit-js';
    export class Timer extends FakeEventTarget {
        private intervalID;
        private readonly TIME_UPDATE_RATE;
        private _currentTime;
        private playbackRate;
        private duration;
        constructor();
        start(duration: number): void;
        private handleRestart;
        pause(): void;
        seek(to: number): void;
        speed(playbackRate: number): void;
        get currentTime(): number;
        private isTimeUp;
        private onTimeIsUp;
        reset(): void;
    }
}
declare module "doc-player" {
    import { IEngine, FakeEventTarget } from '@playkit-js/playkit-js';
    export class DocPlayer extends FakeEventTarget implements IEngine {
        static _logger: any;
        static id: string;
        private eventManager;
        private el;
        private source;
        private config;
        private _playbackRate;
        private timer;
        private isFirstPlay;
        constructor(source: any, config: any);
        private init;
        private setDefaultConfig;
        private createImageElement;
        load(startTime: number): Promise<{
            tracks: [];
        }>;
        private attach;
        play(): Promise<void>;
        private isTimedImage;
        private onImageLoaded;
        private concatenateThumbnailParams;
        private shouldAddKs;
        private getPlayerWidth;
        static isSupported(): boolean;
        static createEngine(source: any, config: any): IEngine;
        static canPlaySource(source: any): boolean;
        static runCapabilities(): void;
        static getCapabilities(): Promise<any>;
        static prepareVideoElement(): void;
        attachMediaSource(): void;
        destroy(): void;
        detach(): void;
        detachMediaSource(): void;
        enableAdaptiveBitrate(): void;
        enterPictureInPicture(): void;
        exitPictureInPicture(): void;
        getStartTimeOfDvrWindow(): number;
        getVideoElement(): HTMLImageElement;
        hideTextTrack(): void;
        isAdaptiveBitrateEnabled(): boolean;
        isLive(): boolean;
        isPictureInPictureSupported(): boolean;
        pause(): void;
        reset(): void;
        resetAllCues(): void;
        restore(source: any, config: any): void;
        seekToLiveEdge(): void;
        selectAudioTrack(audioTrack: any): void;
        selectTextTrack(textTrack: TextTrack): void;
        selectVideoTrack(videoTrack: any): void;
        get id(): string;
        get playbackRates(): number[];
        set playbackRate(playbackRate: number);
        get playbackRate(): number;
        get duration(): number;
        get currentTime(): number;
        set currentTime(to: number);
        get buffered(): TimeRanges;
        getThumbnail(time: number): null;
    }
}
declare module "index" { }

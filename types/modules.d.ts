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
        end(): void;
        private handleRestart;
        seek(to: number): void;
        speed(playbackRate: number): void;
        get currentTime(): number;
        private isTimeUp;
        private onTimeIsUp;
        reset(): void;
    }
}
declare module "components/doc-overlay/doc-overlay" {
    export interface IvqOverlayProps {
        onPreview?: () => void;
        previewText?: string;
        previewButtonText?: string;
        onDownload?: () => void;
        downloadText?: string;
        downloadButtonText?: string;
        contentUnavailableText?: string;
    }
    export const DocOverlay: any;
}
declare module "components/doc-overlay/index" {
    export * from "components/doc-overlay/doc-overlay";
}
declare module "doc-player" {
    import { IEngine, FakeEventTarget } from '@playkit-js/playkit-js';
    export class DocPlayer extends FakeEventTarget implements IEngine {
        static _logger: any;
        static id: string;
        static configName: string;
        private eventManager;
        private el;
        private source;
        private config;
        private _playbackRate;
        private timer;
        private isFirstPlay;
        private isLoadingStart;
        private isReloadedOnfullscreen;
        private docOverlay;
        constructor(source: any, config: any);
        get player(): any;
        private init;
        private setDefaultConfig;
        private createImageElement;
        private updSourceParams;
        private shouldAddKs;
        private getPlayerWidth;
        load(startTime: number): Promise<{
            tracks: [];
        }>;
        private addListeners;
        private addUI;
        private onPreview;
        private onDownload;
        private reloadHigherQualityOnFullscreen;
        play(): Promise<void>;
        private isTimedDoc;
        private onImageLoaded;
        static isSupported(): boolean;
        static createEngine(source: any, config: any): IEngine;
        static canPlaySource(source: any): boolean;
        static runCapabilities(): void;
        static getCapabilities(): Promise<any>;
        static prepareVideoElement(): void;
        attachMediaSource(): void;
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
        resetAllCues(): void;
        restore(source: any, config: any): void;
        seekToLiveEdge(): void;
        selectAudioTrack(audioTrack: any): void;
        selectTextTrack(textTrack: TextTrack): void;
        selectVideoTrack(videoTrack: any): void;
        get src(): string;
        get id(): string;
        get playbackRates(): number[];
        set playbackRate(playbackRate: number);
        get playbackRate(): number;
        get duration(): number;
        get currentTime(): number;
        set currentTime(to: number);
        get buffered(): TimeRanges;
        getThumbnail(time: number): null;
        getDrmInfo(): null;
        reset(): void;
        destroy(): void;
    }
}
declare module "index" { }

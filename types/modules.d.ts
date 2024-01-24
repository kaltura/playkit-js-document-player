/// <reference path="../src/global.d.ts" />
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
        setSpeed(playbackRate: number): void;
        get currentTime(): number;
        private isTimeUp;
        private onTimeIsUp;
        reset(): void;
    }
}
declare module "doc-player-engine" {
    import { IEngine, FakeEventTarget } from '@playkit-js/playkit-js';
    import { KalturaPlayer } from '@playkit-js/kaltura-player-js';
    export class DocumentPlayerEngine extends FakeEventTarget implements IEngine {
        static _logger: any;
        static id: string;
        static getPlayerWidth: () => number;
        static player: KalturaPlayer;
        private eventManager;
        private el;
        private source;
        private config;
        private _playbackRate;
        private timer;
        private isFirstPlay;
        private isLoadingStart;
        private isReloadedOnfullscreen;
        constructor(source: any, config: any);
        private init;
        private setDefaultConfig;
        private createImageElement;
        private updSourceParams;
        private shouldAddKs;
        load(): Promise<{
            tracks: [];
        }>;
        private addListeners;
        private reloadHigherQualityOnFullscreen;
        play(): Promise<void>;
        private isTimedDoc;
        private onImageLoaded;
        static isSupported(): boolean;
        static createEngine(source: any, config: any): IEngine;
        static canPlaySource(): boolean;
        static runCapabilities(): void;
        static getCapabilities(): Promise<any>;
        static setCapabilities(): void;
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
        selectAudioTrack(): void;
        selectTextTrack(): void;
        selectVideoTrack(): void;
        get src(): string;
        get id(): string;
        get playbackRates(): number[];
        set playbackRate(playbackRate: number);
        get playbackRate(): number;
        get duration(): number;
        get currentTime(): number;
        set currentTime(to: number);
        get buffered(): TimeRanges;
        getThumbnail(): null;
        getDrmInfo(): null;
        reset(): void;
        destroy(): void;
    }
}
declare module "components/doc-overlay/doc-overlay" {
    export interface DocumentOverlayProps {
        onPreview?: () => void;
        previewText?: string;
        previewButtonText?: string;
        onDownload?: () => void;
        downloadText?: string;
        downloadButtonText?: string;
        contentUnavailableText?: string;
    }
    export const DocumentOverlay: any;
}
declare module "components/doc-overlay/index" {
    export * from "components/doc-overlay/doc-overlay";
}
declare module "types/doc-player-config" {
    export interface DocumentPlayerConfig {
        basePreviewUrl: string;
        downloadDisabled: boolean;
    }
}
declare module "doc-player" {
    import { core } from '@playkit-js/kaltura-player-js';
    import { DocumentPlayerConfig } from "types/doc-player-config";
    export const pluginName = "playkit-js-document-player";
    export class PlaykitJsDocumentPlugin extends core.BasePlugin {
        private player;
        private config;
        static defaultConfig: DocumentPlayerConfig;
        private docOverlayDisposer;
        constructor(name: string, player: any, config: DocumentPlayerConfig);
        static isValid(): boolean;
        loadMedia(): void;
        private addUI;
        private onPreview;
        private onDownload;
        reset(): void;
        destroy(): void;
    }
}
declare module "index" {
    import { PlaykitJsDocumentPlugin } from "doc-player";
    const VERSION: string;
    const NAME: string;
    export { PlaykitJsDocumentPlugin as Plugin };
    export { VERSION, NAME };
}

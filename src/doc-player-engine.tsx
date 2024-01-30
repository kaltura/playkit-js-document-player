// TODO use updated player types
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

import { IEngine, FakeEventTarget, FakeEvent, EventManager, EventType, getLogger, Utils } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '@playkit-js/kaltura-player-js';
import { Timer } from './timer';

const PLAYBACK_RATES = [0.5, 1, 1.5, 2];
const FULL_SCREEN_EVENTS: Array<string> = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange'];

export class DocumentPlayerEngine extends FakeEventTarget implements IEngine {
  public static _logger: any = getLogger('Document');
  public static id = 'document';
  public static getPlayerWidth: () => number;
  public static player: KalturaPlayer;

  private eventManager: EventManager;
  private el!: HTMLImageElement;
  private source: any;
  private config: any;
  private _playbackRate: number;
  private timer: Timer;
  private isFirstPlay: boolean;
  private isLoadingStart: boolean;
  private isReloadedOnfullscreen: boolean;

  constructor(source: any, config: any) {
    super();
    this.eventManager = new EventManager();
    this._playbackRate = 1;
    this.timer = new Timer();
    this.isFirstPlay = true;
    this.isLoadingStart = false;
    this.isReloadedOnfullscreen = false;
    this.createImageElement();
    this.init(source, config);
  }

  private init(source: any, config: any): void {
    this.source = source;
    this.config = config;
    this.setDefaultConfig();
    this.updSourceParams();
    this.addListeners();
  }

  private setDefaultConfig(): void {
    this.config.playback.autoplay = true;
  }

  private createImageElement(): void {
    this.el = document.createElement('img');
    this.el.id = Utils.Generator.uniqueId(5);
  }

  private updSourceParams(): void {
    const docAPIParams: Record<string, string> = {
      ...(this.shouldAddKs() && { ks: this.config.session.ks })
    };

    const docThumbParams: any = {
      width: DocumentPlayerEngine.getPlayerWidth()
    };

    Object.keys(docAPIParams).forEach((parmaName: string) => {
      this.source.url += `/${parmaName}/${docAPIParams[parmaName]}`;
    });
    Object.keys(docThumbParams).forEach((parmaName: string) => {
      this.source.thumbnailUrl += `/${parmaName}/${docThumbParams[parmaName]}`;
    });
  }

  private shouldAddKs(): boolean {
    return typeof this.config.session?.isAnonymous === 'boolean' && !this.config.session.isAnonymous;
  }

  public async load(): Promise<{ tracks: [] }> {
    this.isLoadingStart = true;
    return new Promise((resolve, reject) => {
      this.el.onload = (): void => {
        resolve({ tracks: [] });
        this.onImageLoaded();
      };
      this.el.onerror = (error): void => {
        DocumentPlayerEngine._logger.error(`The document thumbnail failed to load, url:${this.source?.thumbnailUrl}`, error);
        reject(error);
      };
      this.dispatchEvent(new FakeEvent(EventType.LOAD_START));
      this.el.src = this.source.thumbnailUrl;
    });
  }

  private addListeners(): void {
    this.eventManager.listen(this.timer, EventType.ENDED, (event: FakeEvent) => this.dispatchEvent(event));
    this.eventManager.listen(this.timer, EventType.TIME_UPDATE, (event: FakeEvent) => this.dispatchEvent(event));
    FULL_SCREEN_EVENTS.forEach((fullScreenEvent) =>
      this.eventManager.listen(document, fullScreenEvent, () => {
        this.reloadHigherQualityOnFullscreen();
      })
    );
  }

  private reloadHigherQualityOnFullscreen(): void {
    if (document.fullscreenElement && !this.isReloadedOnfullscreen) {
      const currentWidth = DocumentPlayerEngine.getPlayerWidth();
      const fullscreenWidth = document.body.offsetWidth;
      if (currentWidth < fullscreenWidth) {
        this.source.thumbnailUrl = this.source.thumbnailUrl.replace(/\/width\/([0-9]+)/, `/width/${fullscreenWidth}`);
        this.load().then(() => {
          DocumentPlayerEngine._logger.debug('Entering fullscreen mode - preview reloaded');
        });
        this.isReloadedOnfullscreen = true;
      }
    }
  }

  public play(): Promise<void> {
    if (this.isTimedDoc()) {
      this.timer.start(this.duration);
    }
    this.dispatchEvent(new FakeEvent(EventType.PLAYBACK_START));
    this.dispatchEvent(new FakeEvent(EventType.PLAY));

    if (this.isFirstPlay) {
      this.dispatchEvent(new FakeEvent(EventType.FIRST_PLAY));
      this.isFirstPlay = false;
    }
    this.dispatchEvent(new FakeEvent(EventType.DURATION_CHANGE));
    this.dispatchEvent(new FakeEvent(EventType.PLAYING));
    if (this.isFirstPlay) {
      this.dispatchEvent(new FakeEvent(EventType.FIRST_PLAYING));
    }
    return Promise.resolve();
  }

  private isTimedDoc(): boolean {
    return this.config.sources.duration > 0;
  }

  private onImageLoaded(): void {
    this.dispatchEvent(new FakeEvent(EventType.LOADED_METADATA));
    this.dispatchEvent(new FakeEvent(EventType.LOADED_DATA));
  }

  public static isSupported(): boolean {
    return true;
  }

  public static createEngine(source: any, config: any): IEngine {
    // @ts-ignore
    return new this(source, config);
  }

  public static canPlaySource(): boolean {
    return true;
  }

  public static runCapabilities(): void {
    return;
  }

  public static getCapabilities(): Promise<any> {
    const capabilities = {
      [DocumentPlayerEngine.id]: {
        autoplay: true
      }
    };
    return Promise.resolve(capabilities);
  }

  public static setCapabilities(): void {}

  public static prepareVideoElement(): void {
    DocumentPlayerEngine._logger.debug('Prepare the Image element for document preview');
  }

  public attachMediaSource(): void {}

  public detach(): void {}

  public detachMediaSource(): void {}

  public enableAdaptiveBitrate(): void {}

  public enterPictureInPicture(): void {}

  public exitPictureInPicture(): void {}

  public getStartTimeOfDvrWindow(): number {
    return 0;
  }

  // @ts-ignore
  public getVideoElement(): HTMLImageElement {
    return this.el;
  }

  public hideTextTrack(): void {}

  public isAdaptiveBitrateEnabled(): boolean {
    return false;
  }

  public isLive(): boolean {
    return false;
  }

  public isPictureInPictureSupported(): boolean {
    return false;
  }

  public pause(): void {
    this.timer.end();
    this.dispatchEvent(new FakeEvent(EventType.PAUSE));
  }

  public resetAllCues(): void {}

  public restore(source: any, config: any): void {
    this.reset();
    this.init(source, config);
  }

  public seekToLiveEdge(): void {}

  public selectAudioTrack(): void {}

  public selectTextTrack(): void {}

  public selectVideoTrack(): void {}

  public get paused(): boolean {
    return !this.timer.isActive();
  }

  public get src(): string {
    return this.isLoadingStart && this.source ? this.source.url : '';
  }

  public get id(): string {
    return DocumentPlayerEngine.id;
  }

  public get playbackRates(): number[] {
    return PLAYBACK_RATES;
  }

  public set playbackRate(playbackRate: number) {
    this._playbackRate = playbackRate;
    this.timer.setSpeed(playbackRate);
    this.dispatchEvent(new FakeEvent(EventType.RATE_CHANGE));
  }

  public get playbackRate(): number {
    return this._playbackRate;
  }

  public get duration(): number {
    return this.config.sources.duration;
  }

  public get currentTime(): number {
    return this.timer.currentTime;
  }

  public set currentTime(to: number) {
    this.timer.seek(to);
    this.dispatchEvent(new FakeEvent(EventType.SEEKED));
  }

  public get buffered(): TimeRanges {
    return {
      start(): number {
        return 0;
      },
      end(): number {
        return 0;
      },
      length: 0
    };
  }

  public getThumbnail(): null {
    return null;
  }

  public getDrmInfo(): null {
    return null;
  }

  public reset(): void {
    this.eventManager.removeAll();
    this.isFirstPlay = true;
    this.isLoadingStart = false;
    this.isReloadedOnfullscreen = false;
    this.playbackRate = 1;
    this.timer.reset();
  }

  public destroy(): void {
    this.reset();
    this.el.remove();
  }
}

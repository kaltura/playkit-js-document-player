// These lint rules are temporarily disabled until our fully typescript support is added
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

// @ts-ignore
import { IEngine, FakeEventTarget, FakeEvent, EventManager, EventType, getLogger, Utils } from '@playkit-js/playkit-js';
// import {h} from 'preact';
// import {ui} from '@playkit-js/kaltura-player-js';
import { Timer } from './timer';
// import {DocOverlay} from "./components/doc-overlay";

const PLAYBACK_RATES = [0.5, 1, 1.5, 2];

export class DocPlayer extends FakeEventTarget implements IEngine {
  public static _logger: any = getLogger('Document');
  public static id = 'doc';
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
    this.addUI();
  }

  private setDefaultConfig(): void {
    this.config.playback.autoplay = true;
  }

  private createImageElement(): void {
    this.el = document.createElement('img');
    this.el.id = Utils.Generator.uniqueId(5);
  }

  private updSourceParams(): void {
    const docAPIParams: any = {
      ...(this.shouldAddKs() && { ks: this.config.session.ks }),
    };

    const docThumbParams: any = {
      width: this.getPlayerWidth(),
    }

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

  private getPlayerWidth(): number {
    return document.getElementById(this.config.targetId)!.offsetWidth;
  }

  public async load(startTime: number): Promise<{ tracks: [] }> {
    this.isLoadingStart = true;
    return new Promise((resolve, reject) => {
      this.el.onload = (): void => {
        resolve({ tracks: [] });
        this.onImageLoaded();
      };
      this.el.onerror = (error): void => {
        DocPlayer._logger.error(`The doc thumbnail failed to load, url:${this.source.url}`, error);
        reject(error);
      };
      // @ts-ignore
      this.dispatchEvent(new FakeEvent(EventType.LOAD_START));
      this.el.src = this.source.thumbnailUrl;
    });
  }

  private addListeners(): void {
    // @ts-ignore
    this.eventManager.listen(this.timer, EventType.ENDED, (event: FakeEvent) => this.dispatchEvent(event));
    // @ts-ignore
    this.eventManager.listen(this.timer, EventType.TIME_UPDATE, (event: FakeEvent) => this.dispatchEvent(event));
    this.eventManager.listen(document.getElementById(this.config.targetId), 'fullscreenchange', (event: string) => {
      this.reloadHigherQualityOnFullscreen();
    });
  }

  private addUI(): void {
    // // @ts-ignore
    // console.log(">> kp", KalturaPlayer)
    // console.log(">> ui", ui)
    // console.log(">> this", this)
    //  // @ts-ignore
    // ui.UIManager.addComponent({
    //   label: 'kaltura-ivq-review-screen',
    //   presets: ['Playback'],
    //   container: 'GuiArea',
    //   get: () => {
    //     return <DocOverlay />;
    //   }
    // })
  }

  private reloadHigherQualityOnFullscreen(): void {
    if (document.fullscreenElement && !this.isReloadedOnfullscreen) {
      const currentWidth = this.getPlayerWidth();
      const fullscreenWidth = document.body.offsetWidth;
      if (currentWidth < fullscreenWidth) {
        this.source.thumbnailUrl = this.source.thumbnailUrl.replace(/\/width\/([0-9]+)/, `/width/${fullscreenWidth}`);
        this.load(0).then(() => {
          DocPlayer._logger.debug('Entering fullscreen mode - image reloaded');
        });
        this.isReloadedOnfullscreen = true;
      }
    }
  }

  public play(): Promise<void> {
    if (this.isTimedImage()) this.timer.start(this.duration);
    // @ts-ignore
    this.dispatchEvent(new FakeEvent(EventType.PLAYBACK_START));

    // @ts-ignore
    this.dispatchEvent(new FakeEvent(EventType.PLAY));

    if (this.isFirstPlay) {
      // @ts-ignore
      this.dispatchEvent(new FakeEvent(EventType.FIRST_PLAY));
      this.isFirstPlay = false;
    }
    // @ts-ignore
    this.dispatchEvent(new FakeEvent(EventType.DURATION_CHANGE));

    // @ts-ignore
    this.dispatchEvent(new FakeEvent(EventType.PLAYING));
    // @ts-ignore
    if (this.isFirstPlay) this.dispatchEvent(new FakeEvent(EventType.FIRST_PLAYING));
    return Promise.resolve();
  }

  private isTimedImage(): boolean {
    return this.config.sources.duration > 0;
  }

  private onImageLoaded(): void {
    // @ts-ignore
    this.dispatchEvent(new FakeEvent(EventType.LOADED_METADATA));
    // @ts-ignore
    this.dispatchEvent(new FakeEvent(EventType.LOADED_DATA));
  }

  public static isSupported(): boolean {
    return true;
  }

  public static createEngine(source: any, config: any): IEngine {
    return new this(source, config);
  }

  public static canPlaySource(source: any): boolean {
    return true;
  }

  public static runCapabilities(): void {
    return;
  }

  public static getCapabilities(): Promise<any> {
    const capabilities = {
      [DocPlayer.id]: {
        autoplay: true
      }
    };
    return Promise.resolve(capabilities);
  }

  public static prepareVideoElement(): void {
    DocPlayer._logger.debug('Prepare the Image element for doc preview');
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
    // @ts-ignore
    this.dispatchEvent(new FakeEvent(EventType.PAUSE));
  }

  public resetAllCues(): void {}

  public restore(source: any, config: any): void {
    this.reset();
    this.init(source, config);
  }

  public seekToLiveEdge(): void {}

  public selectAudioTrack(audioTrack: any): void {}

  public selectTextTrack(textTrack: TextTrack): void {}

  public selectVideoTrack(videoTrack: any): void {}

  public get src(): string {
    return this.isLoadingStart && this.source ? this.source.url : '';
  }

  public get id(): string {
    return DocPlayer.id;
  }

  public get playbackRates(): number[] {
    return PLAYBACK_RATES;
  }

  public set playbackRate(playbackRate: number) {
    this._playbackRate = playbackRate;
    this.timer.speed(playbackRate);
    // @ts-ignore
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
    // @ts-ignore
    this.dispatchEvent(new FakeEvent(EventType.SEEKED));
  }

  public get buffered(): TimeRanges {
    return {
      start(index: number): number {
        return 0;
      },
      end(index: number): number {
        return 0;
      },
      length: 0
    };
  }

  public getThumbnail(time: number): null {
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

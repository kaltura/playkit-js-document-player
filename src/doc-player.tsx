// TODO use updated player types
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/no-empty-function */

import { h } from 'preact';
import { registerEngine } from '@playkit-js/playkit-js';
import { core } from '@playkit-js/kaltura-player-js';
import { DocumentPlayerEngine } from './doc-player-engine';
import { DocumentOverlay, DocumentOverlayProps } from './components/doc-overlay';
import { DocumentPlayerConfig } from './types/doc-player-config';

const PRESET_AREAS = ['Document', 'Playback'];

export const pluginName = 'playkit-js-document-player';

// @ts-ignore
export class PlaykitJsDocumentPlugin extends core.BasePlugin {
  static defaultConfig: DocumentPlayerConfig = {
    basePreviewUrl: '',
    downloadDisabled: true
  };

  private docOverlayDisposer: (() => void) | null = null;

  constructor(
    name: string,
    private player: any,
    config: DocumentPlayerConfig
  ) {
    super(name, player, config);
    DocumentPlayerEngine.getPlayerWidth = (): number => {
      const playerState = this.player.ui.store.getState();
      return Math.round(playerState?.shell?.guiClientRect?.width);
    };
    registerEngine(DocumentPlayerEngine.id, DocumentPlayerEngine);
  }

  static isValid(): boolean {
    return true;
  }

  loadMedia(): void {
    if (this.player.isDocument()) {
      this.addUI();
    }
  }

  private addUI(): void {
    // @ts-ignore
    const { basePreviewUrl, downloadDisabled } = this.config;
    const docOverlayProps: DocumentOverlayProps = {
      sourceName: this.player.sources.metadata?.name
    };
    if (basePreviewUrl) {
      docOverlayProps.onPreview = (): void => this.onPreview(`${basePreviewUrl}${this.player.sources.id}`);
    } else if (!downloadDisabled) {
      docOverlayProps.onDownload = this.onDownload;
    }

    this.docOverlayDisposer = this.player.ui.addComponent({
      label: 'kaltura-document-player',
      presets: PRESET_AREAS,
      container: 'GuiArea',
      get: () => {
        return <DocumentOverlay {...docOverlayProps} />;
      }
    });
  }

  private onPreview = (url: string): void => {
    (window as any).open(url, '_blank').focus();
  };

  private onDownload = (): void => {
    const aElement = document.createElement('a');
    aElement.href = this.player.selectedSource.url;
    aElement.hidden = true;
    aElement.download = this.player.sources.metadata?.name || this.player.selectedSource.id;
    aElement.rel = 'noopener noreferrer';
    aElement.click();
  };

  reset(): void {
    if (this.docOverlayDisposer) {
      this.docOverlayDisposer();
      this.docOverlayDisposer = null;
    }
  }

  destroy(): void {}
}

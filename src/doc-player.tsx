import { h } from 'preact';
// @ts-ignore
import { registerEngine } from '@playkit-js/playkit-js';
import { core } from '@playkit-js/kaltura-player-js';
import { DocumentPlayerEngine } from './doc-player-engine';
import { DocumentOverlay, DocumentOverlayProps } from './components/doc-overlay';
import { DocumentPlayerConfig } from './types/doc-player-config';

const PRESET_AREAS = ['Document', 'Playback'];

export const pluginName: string = 'playkit-js-doc-player';

// @ts-ignore
export class PlaykitJsDocumentPlugin extends core.BasePlugin {
  static defaultConfig: DocumentPlayerConfig = {
    basePreviewUrl: '',
    downloadDisabled: false
  };

  private docOverlayDisposer: (() => void) | null = null;

  constructor(name: string, private player: any, private config: DocumentPlayerConfig) {
    super(name, player, config);
    registerEngine(DocumentPlayerEngine.id, DocumentPlayerEngine);
  }

  static isValid(): boolean {
    return true;
  }

  loadMedia() {
    if (this.player.isDocument()) {
      this.addUI();
    }
  }

  private addUI(): void {
    const docOverlayProps: DocumentOverlayProps = {};
    if (this.config?.basePreviewUrl) {
      docOverlayProps.onPreview = (): void => this.onPreview(`${this.config?.basePreviewUrl}${this.player.sources.id}`);
    } else if (!this.config?.downloadDisabled) {
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
    }
  }

  destroy(): void {}
}

/* eslint-disable  @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import { ui } from '@playkit-js/kaltura-player-js';
import { OverlayPortal } from '@playkit-js/common/dist/hoc/overlay-portal';
import { Button, ButtonSize, ButtonType } from '@playkit-js/common/dist/components/button';
import * as styles from './doc-overlay.scss';

const { withText, Text } = ui.preacti18n;

const translates = {
  previewText: <Text id="docPlayer.previewText">Click to view</Text>,
  previewButtonText: <Text id="docPlayer.previewButtonText">View document</Text>,
  downloadText: <Text id="docPlayer.downloadText">is unavailable, download to view.</Text>,
  downloadButtonText: <Text id="docPlayer.downloadButtonText">Download document</Text>,
  contentUnavailableText: <Text id="docPlayer.contentUnavailableText">is unavailable to view.</Text>
};

export interface DocumentOverlayProps {
  onPreview?: () => void;
  previewText?: string;
  previewButtonText?: string;
  onDownload?: () => void;
  downloadText?: string;
  downloadButtonText?: string;
  contentUnavailableText?: string;
  sourceName?: string;
}

export const DocumentOverlay = withText(translates)((props: DocumentOverlayProps) => {
  const getContent = (): { text: string; buttonText?: string; onClick?: () => void } => {
    if (props.onPreview) {
      return {
        text: `${props.previewText!} ${props.sourceName}`,
        buttonText: props.previewButtonText!,
        onClick: props.onPreview
      };
    } else if (props.onDownload) {
      return {
        text: `${props.sourceName} ${props.downloadText!}`,
        buttonText: props.downloadButtonText!,
        onClick: props.onDownload
      };
    }
    return {
      text: `${props.sourceName} ${props.contentUnavailableText!}`
    };
  };

  const content = getContent();
  return (
    <OverlayPortal>
      <div className={styles.docOverlay} data-testid="doc-player-overlay">
        <div className={styles.docTextWrapper}>{content.text}</div>
        {content.buttonText && (
          <Button onClick={content.onClick} type={ButtonType.primary} size={ButtonSize.medium} testId="doc-player-button">
            {content.buttonText}
          </Button>
        )}
      </div>
    </OverlayPortal>
  );
});

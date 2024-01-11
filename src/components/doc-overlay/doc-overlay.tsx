import { h } from 'preact';
import { ui } from '@playkit-js/kaltura-player-js';
import { OverlayPortal } from '@playkit-js/common/dist/hoc/overlay-portal';
import { Button, ButtonSize, ButtonType } from '@playkit-js/common/dist/components/button';
import * as styles from './doc-overlay.scss';

const { withText, Text } = ui.preacti18n;

const translates = {
  previewText: <Text id="docPlayer.previewText">Click to view Supply & Demand</Text>,
  previewButtonText: <Text id="docPlayer.previewButtonText">View document</Text>,
  downloadText: <Text id="docPlayer.downloadText">Supply & Demand is unavailable, download to view.</Text>,
  downloadButtonText: <Text id="docPlayer.downloadButtonText">Download document</Text>,
  contentUnavailableText: <Text id="docPlayer.contentUnavailableText">Supply & Demand is unavailable to view.</Text>
};

export interface IvqOverlayProps {
  previewUrl?: string;
  previewText?: string;
  previewButtonText?: string;
  downloadUrl?: string;
  downloadText?: string;
  downloadButtonText?: string;
  contentUnavailableText?: string;
}

export const DocOverlay = withText(translates)((props: IvqOverlayProps) => {
  const getContent = (): { text: string; buttonText?: string; onClick?: () => void } => {
    if (props.previewUrl) {
      return {
        text: props.previewText!,
        buttonText: props.previewButtonText!,
        onClick: () => {} // TODO: open props.previewUrl
      };
    } else if (props.downloadUrl) {
      return {
        text: props.downloadText!,
        buttonText: props.downloadButtonText!,
        onClick: () => {} // TODO: download props.downloadUrl
      };
    }
    return {
      text: props.contentUnavailableText!
    };
  };

  const content = getContent();
  return (
    <OverlayPortal>
      <div className={styles.docOverlay}>
        <div className={styles.docTextWrapper}>{content.text}</div>
        {content.buttonText && (
          <Button onClick={content.onClick} type={ButtonType.primary} size={ButtonSize.medium}>
            {content.buttonText}
          </Button>
        )}
      </div>
    </OverlayPortal>
  );
});

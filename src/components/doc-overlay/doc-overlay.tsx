import { h, ComponentChild } from 'preact';
import * as styles from './doc-overlay.scss';
import { OverlayPortal } from '@playkit-js/common/dist/hoc/overlay-portal';

// @ts-ignore
const { Overlay } = KalturaPlayer.ui.components;

interface IvqOverlayProps {
  children?: any;
}

export const DocOverlay = ({ children }: IvqOverlayProps) => {
  return (
    <OverlayPortal>
      <div className={styles.docOverlay}>
        <Overlay open permanent>
          <div>test</div>
        </Overlay>
      </div>
    </OverlayPortal>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { registerEngine } from '@playkit-js/playkit-js';
import { DocPlayer } from './doc-player';

registerEngine(DocPlayer.id, DocPlayer);

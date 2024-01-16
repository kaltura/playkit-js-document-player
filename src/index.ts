/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference path="./global.d.ts" />
// @ts-ignore
import { registerEngine } from '@playkit-js/playkit-js';
import { DocPlayer } from './doc-player';

registerEngine(DocPlayer.id, DocPlayer);

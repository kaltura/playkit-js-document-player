/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./global.d.ts" />

// @ts-ignore
import { registerPlugin } from '@playkit-js/playkit-js';
import { PlaykitJsDocumentPlugin, pluginName } from './doc-player';

declare let __VERSION__: string;
declare let __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export { PlaykitJsDocumentPlugin as Plugin };
export { VERSION, NAME };

registerPlugin(pluginName, PlaykitJsDocumentPlugin);

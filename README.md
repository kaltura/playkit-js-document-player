# PlayKit JS Doc Player - Doc Player plugin for the [PlayKit JS Player]

[![Build Status](https://github.com/kaltura/playkit-js-document-player/actions/workflows/run_canary.yaml/badge.svg)](https://github.com/kaltura/playkit-js-document-player/actions/workflows/run_canary.yaml)
[![](https://img.shields.io/npm/v/@playkit-js/document-player/latest.svg)](https://www.npmjs.com/package/@playkit-js/document-player)
[![](https://img.shields.io/npm/v/@playkit-js/document-player/canary.svg)](https://www.npmjs.com/package/@playkit-js/document-player/v/canary)

playkit-js-document-player is a [kaltura player] engine enabling [kaltura player] to play an Doc

playkit-js-document-player is written in [ECMAScript6] (`*.js`) and [TypeScript] (`*.ts`) (strongly typed superset of ES6), 
and transpiled in ECMAScript5 using [Babel](https://babeljs.io/) and the [TypeScript compiler].

[Webpack] is used to build the distro bundle and serve the local development environment.

[kaltura player]: https://github.com/kaltura/kaltura-player-js.
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[typescript]: https://www.typescriptlang.org/
[typescript compiler]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[webpack]: https://webpack.js.org/

## Features

There are two modes an Doc playback can be played in the Kaltura player

Doc can be played as one of the following modes

- **Non-Durational Doc**
- **Durational Doc**

Non-Durational Docs will be displayed by the player without a seek bar and the standard player controls (except the full-screen button)

Durational Docs will be played by the player as if it is a video,
with seek bar and all standard player controls
In fact it will behave just like a video for everything

If the Doc is played as part of a playlist, it will automatically play as a **Durational Doc** with a default duration of 5 seconds

The Doc mode will be determined according to the duration configured with the entry
    
## Getting started with development

```sh
# First, checkout the repository and install the required dependencies
git clone https://github.com/kaltura/playkit-js-document-player.git

# Navigate to the repo dir
cd playkit-js-document-player

# Run dev-server for demo page (recompiles on file-watch, and write to actual dist fs artifacts)
npm run serve

# Before submitting a PR - Run the pre commit command
npm run precommit

# this command will run:

# 1. types check
# 2. lint check
# 3. generate/update types
```

The dev server will host files on port 8000. Once started, the demo can be found running at http://localhost:8000/.

Before submitting a PR, please see our [contribution guidelines](CONTRIBUTING.md).


### Linter (ESlint)

Run linter:

```
npm run lint
```

Run linter with auto-fix mode:

```
npm run lint:fix
```

### Formatting Code

Run prettier to format code

```
npm run prettier
```

### Type Check

Run type-check to verify TypeScript types

```
npm run type-check
```

### Building

Then, build the plugin

```javascript
yarn run build
```

### Testing

The plugin uses `cypress` tool for e2e tests

```javascript
yarn run test
```

UI conf file (`cypress/public/ui-conf.js`) contains Kaltura player and plugin dependencies.
Keep Kaltura player and dependency versinos aligned to currently released versions.

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<script type="text/javascript" src="/PATH/TO/FILE/kaltura-player.js"></script>
<!--Kaltura player-->
<script type="text/javascript" src="/PATH/TO/FILE/playkit-document-player.js"></script>
<!--PlayKit doc-player plugin-->
<div id="player-placeholder" style="height:360px; width:640px">
  <script type="text/javascript">
    var playerContainer = document.querySelector("#player-placeholder");
    var config = {
     ...
     targetId: 'player-placeholder',
     plugins: {
      'playkit-js-document-player': { ... }
     }
     ...
    };
    var player = KalturaPlayer.setup(config);
    player.loadMedia(...);
  </script>
</div>
```

#### Configuration Structure

```js
//Default configuration
"playkit-js-document-player" = {};
//Plugin params
"playkit-js-document-player" = {
  basePreviewUrl?: string, // optional
  downloadDisabled?: boolean // optional
}
```
##

> ### config.basePreviewUrl
>
> ##### Type: `string`
>
> ##### Default: `""`;
>

##

> ### config.downloadDisabled
>
> ##### Type: `boolean`
>
> ##### Default: `false`
>


## Compatibility

playkit-js-document-player is supported on:

- Chrome 39+ for Android
- Chrome 39+ for Desktop
- Firefox 41+ for Android
- Firefox 42+ for Desktop
- IE11 for Windows 8.1+
- Edge for Windows 10+
- Safari 8+ for MacOS 10.10+
- Safari for ipadOS 13+

## License

playkit-js-document-player is released under [Apache 2.0 License](LICENSE)


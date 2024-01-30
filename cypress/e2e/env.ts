export const preparePage = (pluginConf: Object, playbackConf: Object, isPlaylist = false) => {
  cy.visit('index.html');
  return cy.window().then(win => {
    try {
      // @ts-ignore
      var kalturaPlayer = win.KalturaPlayer.setup({
        targetId: 'player-placeholder',
        provider: {
          partnerId: -1,
          env: {
            cdnUrl: 'http://mock-cdn',
            serviceUrl: 'http://mock-api'
          }
        },
        plugins: {
          'playkit-js-document-player': pluginConf,
        },
        playback: {...playbackConf}
      });
      if (isPlaylist) {
        return kalturaPlayer.loadPlaylist({playlistId: '1_2q9jefqa'});
      }
      return kalturaPlayer.loadMedia({entryId: '0_wifqaipd'});
    } catch (e: any) {
      return Promise.reject(e.message);
    }
  });
};

export const getPlayer = () => {
  // @ts-ignore
  return cy.window().then($win => $win.KalturaPlayer.getPlayers()['player-placeholder']);
};

export const loadEntry = (pluginConf = {}, playbackConf = {}) => {
  return preparePage(pluginConf, playbackConf).then(() => getPlayer().then(kalturaPlayer => kalturaPlayer));
};
export const loadPlaylist = (pluginConf = {}, playbackConf = {}) => {
  return preparePage(pluginConf, playbackConf, true).then(() => getPlayer().then(kalturaPlayer => kalturaPlayer));
};

const checkRequest = (reqBody: any, service: string, action: string) => {
  return reqBody?.service === service && reqBody?.action === action;
};

export const mockKalturaBe = (entryFixture = 'doc-entry.json', playlistFixture = 'playlist-doc-entry.json') => {
  cy.intercept('http://mock-api/service/multirequest', req => {
    if (checkRequest(req.body[2], 'baseEntry', 'list')) {
      return req.reply({fixture: entryFixture});
    }
    if (checkRequest(req.body[2], 'playlist', 'get')) {
      return req.reply({fixture: playlistFixture});
    }
  });
};

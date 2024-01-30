import {mockKalturaBe, loadEntry, loadPlaylist} from './env';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Document player', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/mock-thumb/p/1091/**', {fixture: '640.jpeg'}).as("mockThumb");
  });

  describe('document player engine', () => {
    it('should load document entry with thumbnail', () => {
      mockKalturaBe();
      loadEntry().then(() => {
        cy.get('[data-testid="doc-player-overlay"]').should('exist');
        cy.wait("@mockThumb");
        cy.get('.playkit-seek-bar').should('not.exist');
        cy.get('.playkit-left-controls .playkit-playback-controls').should('not.exist');
        cy.get('.playkit-control-fullscreen').should('exist');
      });
    });
    it('should load document entry in playlist', () => {
      mockKalturaBe();
      loadPlaylist().then((kalturaPlayer) => {
        cy.get('[data-testid="doc-player-overlay"]').should('exist');
        cy.wait("@mockThumb");
        cy.get('.playkit-seek-bar').should('exist');
        cy.get('.playkit-control-playlist-button').should('exist');
        cy.get('.playkit-control-fullscreen').should('exist');
        cy.get('.playkit-control-play-pause').should('exist').then(() => {
          expect(kalturaPlayer.paused).to.equal(false);
        });
      });
    });
  });

  describe('document player configuration', () => {
    it('should load document entry with preview', () => {
      mockKalturaBe();
      loadEntry({ basePreviewUrl: "http://test-preview-url/"}).then(() => {
        cy.window().then((win) => {
          cy.stub(win, 'open').as('previewUrl')
          cy.get('[data-testid="doc-player-button"]').should('exist');
          cy.get('[data-testid="doc-player-button"]').should('have.text', "View document");
          cy.get('[data-testid="doc-player-button"]').click({ force: true });
          cy.get('@previewUrl').should('have.been.calledOnceWithExactly', "http://test-preview-url/0_wifqaipd", "_blank");
      })
      });
    });

    it('should load document entry with download', () => {
      mockKalturaBe();
      loadEntry({ downloadDisabled: false }).then(() => {
        cy.intercept('GET', 'https://mock-download-document/1').as("downloadUrl");
        cy.get('[data-testid="doc-player-button"]').should('exist');
        cy.get('[data-testid="doc-player-button"]').should('have.text', "Download document");
        cy.get('[data-testid="doc-player-button"]').click({ force: true });
        cy.wait("@downloadUrl");
      });
    });

    it('should load document entry without preview and download', () => {
      mockKalturaBe();
      loadEntry({ downloadDisabled: true }).then(() => {
        cy.get('[data-testid="doc-player-overlay"]').should('exist');
        cy.get('[data-testid="doc-player-button"]').should('not.exist');
      });
    });
  });
});

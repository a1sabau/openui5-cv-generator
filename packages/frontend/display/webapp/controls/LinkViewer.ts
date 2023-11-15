import type { MetadataOptions } from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import Control from 'sap/ui/core/Control';
import Link from 'sap/m/Link';
import VBox from 'sap/m/VBox';

/**
 * @namespace ui5.cv.display.controls
 */
export default class LinkViewer extends Control {
  // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
  constructor(idOrSettings?: string | $LinkViewerSettings);
  constructor(id?: string, settings?: $LinkViewerSettings);
  constructor(id?: string, settings?: $LinkViewerSettings) {
    super(id, settings);
  }

  static readonly metadata: MetadataOptions = {
    properties: {
      links: 'string',
    },
  };

  static renderer = {
    apiVersion: 2,
    render: function (oRm: RenderManager, oControl: LinkViewer) {
      oRm.openStart('div', oControl).class('ui5_cv_spacious').openEnd();

      // needed for odata v2 not supporing entity Projects {... links: many String(200); ...}
      const arrLinkItems = oControl
        .getLinks()
        .split(',')
        .map((link) => {
          return new Link({
            text: link?.replace(/^https?:\/\//, ''),
            href: link,
            target: '_blank',
            subtle: false,
            emphasized: true,
          });
        });

      const vBox = new VBox({
        items: arrLinkItems,
      });
      vBox.addStyleClass('sapUiSmallMarginBottom');

      oRm.renderControl(vBox);
      oRm.close('div');
    },
  };
}

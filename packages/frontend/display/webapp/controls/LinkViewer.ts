import type { MetadataOptions } from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import Control from 'sap/ui/core/Control';
import Link from 'sap/m/Link';
import VBox from 'sap/m/VBox';

interface ILinkViewer {
  getLinks(): string;
}

/**
 * @namespace ui5.cv.display.controls
 */
export default class LinkViewer extends Control {
  static readonly metadata: MetadataOptions = {
    properties: {
      links: 'string',
    },
  };

  static renderer = {
    apiVersion: 2,
    render: function (rm: RenderManager, control: LinkViewer & ILinkViewer) {
      rm.class('ui5_cv_spacious');
      rm.openStart('div', control);
      rm.openEnd();

      // needed for odata v2 not supporing entity Projects {... links: many String(200); ...}
      const linkItems = control
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
        items: linkItems,
      });
      vBox.addStyleClass('sapUiSmallMarginBottom');

      rm.renderControl(vBox);
      rm.close('div');
    },
  };
}

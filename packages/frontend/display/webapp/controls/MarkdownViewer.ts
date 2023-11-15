import type { MetadataOptions } from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import HTML from 'sap/ui/core/HTML';
import Control from 'sap/ui/core/Control';
import Grid from 'sap/ui/layout/Grid';
import GridData from 'sap/ui/layout/GridData';

/**
 * @namespace ui5.cv.display.controls
 */
export default class MarkdownViewer extends Control {
  // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
  constructor(idOrSettings?: string | $MarkdownViewerSettings);
  constructor(id?: string, settings?: $MarkdownViewerSettings);
  constructor(id?: string, settings?: $MarkdownViewerSettings) {
    super(id, settings);
  }

  static readonly metadata: MetadataOptions = {
    properties: {
      content: 'string',
      cols: { type: 'int', defaultValue: 1 },
    },
  };

  static renderer = {
    apiVersion: 2,
    render: function (oRm: RenderManager, oControl: MarkdownViewer) {
      if (!oControl.getContent()) {
        return;
      }

      oRm.openStart('div', oControl).class('ui5_cv_spacious').openEnd();

      const nCols = oControl.getCols();

      if (nCols === 1) {
        oRm.renderControl(new HTML({ content: oControl.getContent(), sanitizeContent: false }));
        oRm.close('div');
        return;
      }

      const colSpan = Math.floor(12 / nCols);
      const pEls = oControl
        .getContent()
        .split(/<p>/)
        .map((el) => el.replace(/<\/p>/, ''))
        .filter((el) => el !== '');

      const grid = new Grid({
        defaultSpan: 'XL12 L12 M12 S12',
        content: pEls.map((el) => {
          return new HTML({
            content: `<p>${el}</p>`,
            sanitizeContent: false,
            layoutData: new GridData({ span: `XL${colSpan} L${colSpan} M12 S12` }),
          });
        }),
      });

      oRm.renderControl(grid);
      oRm.close('div');
    },
  };
}

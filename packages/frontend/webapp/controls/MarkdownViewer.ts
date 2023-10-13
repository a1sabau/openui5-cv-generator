import type { MetadataOptions } from 'sap/ui/core/Element'
import RenderManager from 'sap/ui/core/RenderManager'
import HTML from 'sap/ui/core/HTML'
import Control from 'sap/ui/core/Control'
import HBox from 'sap/m/HBox'
import Grid from 'sap/ui/layout/Grid'
import GridData from 'sap/ui/layout/GridData'

interface IMarkdownViewer {
  getContent(): string
  getCols(): number
}

/**
 * @namespace ui5.cv.controls
 */
export default class MarkdownViewer extends Control {
  static readonly metadata: MetadataOptions = {
    properties: {
      content: 'string',
      cols: { type: 'int', defaultValue: 1 },
    },
  }

  static renderer = {
    apiVersion: 2,
    render: function (rm: RenderManager, control: MarkdownViewer & IMarkdownViewer) {
      if (!control.getContent()) return

      rm.class('ui5_cv_spacious')
      rm.openStart('div', control)
      rm.openEnd()

      const cols = control.getCols()

      if (cols === 1) {
        rm.renderControl(new HTML({ content: control.getContent(), sanitizeContent: false }))
        rm.close('div')
        return
      }

      const colSpan = Math.floor(12 / cols)
      const pEls = control
        .getContent()
        .split(/<p>/)
        .map((el) => el.replace(/<\/p>/, ''))
        .filter((el) => el !== '')

      const grid = new Grid({
        defaultSpan: 'XL12 L12 M12 S12',
        content: pEls.map((el) => {
          return new HTML({
            content: `<p>${el}</p>`,
            sanitizeContent: false,
            layoutData: new GridData({ span: `XL${colSpan} L${colSpan} M12 S12` }),
          })
        }),
      })

      rm.renderControl(grid)
      rm.close('div')
    },

    renderOld: function (rm: RenderManager, control: MarkdownViewer & IMarkdownViewer) {
      if (!control.getContent()) return

      rm.class('ui5_cv_spacious')
      rm.openStart('div', control)
      rm.openEnd()

      const cols = control.getCols()
      const pEls = control
        .getContent()
        .split(/<p>/)
        .map((el) => el.replace(/<\/p>/, ''))
        .filter((el) => el !== '')

      /*
      cols = 2;
      pEls = 5;

      */
      const minElsPerCol = Math.floor(pEls.length / cols)
      let remainingEls = pEls.length % cols

      const colEls = []
      let pElsIdx = 0
      for (let coldIdx = 0; coldIdx < cols; coldIdx++) {
        const incr = pElsIdx + minElsPerCol + (remainingEls > 0 ? 1 : 0)
        const pElsPerCol = pEls.slice(pElsIdx, incr)
        remainingEls = -1
        pElsIdx += incr
        const content = pElsPerCol.map((el) => `<p>${el}</p>`).join('')

        colEls.push(new HTML({ content, sanitizeContent: false }))
      }

      if (colEls.length > 1) {
        rm.renderControl(new HBox({ items: colEls }))
      } else {
        rm.renderControl(colEls[0])
      }

      console.log('PELS', pEls)

      // if (control.getCo)
      // rm.renderControl(new HTML({ content: control.getContent(), sanitizeContent: false }))
      rm.close('div')
    },
  }
}

import ViewType from 'sap/ui/core/mvc/ViewType'
import BlockBase from 'sap/uxap/BlockBase'

export default BlockBase.extend('ui5.cv.blocks.about.AboutBlock', {
  metadata: {
    views: {
      Collapsed: {
        viewName: 'ui5.cv.blocks.about.AboutBlock',
        type: ViewType.XML,
      },
      Expanded: {
        viewName: 'ui5.cv.blocks.about.AboutBlock',
        type: ViewType.XML,
      },
    },
  },
})

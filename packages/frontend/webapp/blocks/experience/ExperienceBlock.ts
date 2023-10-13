import ViewType from 'sap/ui/core/mvc/ViewType'
import BlockBase from 'sap/uxap/BlockBase'

export default BlockBase.extend('ui5.cv.blocks.experience.ExperienceBlock', {
  metadata: {
    views: {
      Collapsed: {
        viewName: 'ui5.cv.blocks.experience.ExperienceBlock',
        type: ViewType.XML,
      },
      Expanded: {
        viewName: 'ui5.cv.blocks.experience.ExperienceBlock',
        type: ViewType.XML,
      },
    },
  },
})

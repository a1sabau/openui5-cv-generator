import CustomListItem from 'sap/m/CustomListItem';
import Link from 'sap/m/Link';
import Controller from 'sap/ui/core/mvc/Controller';
import Context from 'sap/ui/model/odata/v4/Context';

// can be used with odata v4, entity Projects {... links: many String(200); ...}
export default Controller.extend('ui5.cv.blocks.projects.ProjectsBlockController', {
  productListFactory: function (sId: string, oContext: Context) {
    const link = oContext.getProperty(undefined);

    const liEl = new CustomListItem({
      highlight: 'None',
      selected: true,

      content: [
        new Link(sId, {
          text: link?.replace(/^https?:\/\//, ''),
          href: link,
          subtle: false,
          emphasized: true,
        }),
      ],
    });

    liEl.addStyleClass('ui5_cv_noBorder');

    return liEl;
  },
});

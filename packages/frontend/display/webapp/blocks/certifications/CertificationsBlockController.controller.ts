import Controller from 'sap/ui/core/mvc/Controller';
import Filter from 'sap/ui/model/Filter';
import JSONModel from 'sap/ui/model/json/JSONModel';
import ODataModel from 'sap/ui/model/odata/v2/ODataModel';

const TAG_ALL = 'All';

/**
 * @namespace ui5.cv.blocks.certifications
 */
export default abstract class CertificationsBlockController extends Controller {
  availableTagsModel: JSONModel;

  async onInit() {
    const rootModel = this.getOwnerComponent().getModel() as ODataModel;
    const [certificates, tags] = await Promise.all([
      this.readPropertyAsync(rootModel, '/Certifications'),
      this.readPropertyAsync(rootModel, '/Tags'),
    ]);

    const uniqueTags = new Set<string>();

    certificates.forEach((certificate) => {
      certificate.tags.split(',').forEach((tag: string) => uniqueTags.add(tag));
    });

    const orderedTags = Array.from(uniqueTags).sort((tagA, tagB) => {
      const orderA = tags.find((tag) => tag.name === tagA)?.order;
      const orderB = tags.find((tag) => tag.name === tagB)?.order;
      return orderA - orderB;
    });

    const finalTags = [TAG_ALL, ...orderedTags];
    this.availableTagsModel = new JSONModel(finalTags.map((tag) => ({ label: tag, selected: true })));
    this.getView().setModel(this.availableTagsModel, 'availableTags');
  }

  /*
    oPayerModel.attachBatchRequestCompleted(function (oEvent) {
      console.log('attachBatchRequestCompleted oEvent', oEvent);

      const success = oEvent.getParameter('success');
      if (success) {
        const certificationsLoaded = oEvent.getParameter('requests').some((request) => {
          console.log(request.url, request.url.endsWith('Certifications'));
          return request.url.endsWith('Certifications');
        });

        if (certificationsLoaded) {
          console.log('certificationsLoaded');
          const certifications = oPayerModel.getProperty('Certifications');
          console.log('certifications', certifications);
        }
      }
    });
    */

  readPropertyAsync(model: ODataModel, path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      model.read(path, {
        success: ({ results }) => resolve(results),
        error: (error) => reject(error),
      });
    });
  }

  onCheckboxFilterChange(oEvent: any) {
    const tag = oEvent.getSource().data('tag');
    const tagModel = this.availableTagsModel.getData().find((tagData: any) => tagData.label === tag);
    tagModel.selected = oEvent.getParameter('selected');

    if (tag === TAG_ALL) {
      this.availableTagsModel.getData().forEach((tag: any) => (tag.selected = tagModel.selected));
    }

    this.filterByTag();
  }

  filterByTag() {
    const myList = this.getView().byId('certificationsList');

    const selectedTags = this.availableTagsModel
      .getData()
      .filter((tag: any) => tag.selected)
      .map((tag: any) => tag.label);

    var oFilter = new Filter({
      path: 'tags',

      test: function (oValue: string) {
        // no filtering required
        if (selectedTags.includes(TAG_ALL)) return true;

        // filter by tags
        const certificationTags = oValue.split(',');
        return certificationTags.some((certificationTag) => selectedTags.includes(certificationTag));
      },
    });

    myList.getBinding('items').filter(oFilter);
  }

  openLink(oEvent: any) {
    const link = oEvent.getSource().data('link');
    window.open(link, '_blank');
  }
}

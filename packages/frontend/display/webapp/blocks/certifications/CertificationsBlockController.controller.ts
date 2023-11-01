import Controller from 'sap/ui/core/mvc/Controller';
import Filter from 'sap/ui/model/Filter';
import JSONModel from 'sap/ui/model/json/JSONModel';
import ODataModel from 'sap/ui/model/odata/v2/ODataModel';
import { Certification, Tag } from 'openui5-cv-generator-backend/@cds-models/ui5/generator/';
import { CheckBox$SelectEvent } from 'sap/m/CheckBox';
import { Button$PressEvent } from 'sap/m/Button';
import List from 'sap/m/List';
import JSONListBinding from 'sap/ui/model/json/JSONListBinding';

type UITag = Tag & {
  selected: boolean;
};

const TAG_ALL = 'All';

/**
 * @namespace ui5.cv.blocks.certifications
 */
export default abstract class CertificationsBlockController extends Controller {
  private usedTagsModel: JSONModel;

  async onInit() {
    const rootModel = this.getOwnerComponent().getModel() as ODataModel;
    const [certifications, definedTags] = await Promise.all([
      this.readPropertyAsync<Certification[]>(rootModel, '/Certifications'),
      this.readPropertyAsync<Tag[]>(rootModel, '/Tags'),
    ]);

    const usedTags: UITag[] = [];

    certifications.forEach((certification: Certification) => {
      certification.tags.split(',').forEach((tag: string) => {
        if (usedTags.find((uniqueTag) => uniqueTag.name === tag)) {
          return;
        }
        usedTags.push({ name: tag, selected: true });
      });
    });

    const orderedTags = Array.from(usedTags).sort((tagA, tagB) => {
      const orderA = definedTags.find((definedTag) => definedTag.name === tagA.name)?.order;
      const orderB = definedTags.find((definedTag) => definedTag.name === tagB.name)?.order;
      return orderA - orderB;
    });

    this.usedTagsModel = new JSONModel([{ name: TAG_ALL, selected: true }, ...orderedTags]);
    this.getView().setModel(this.usedTagsModel, 'usedTags');
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

  private readPropertyAsync<T>(model: ODataModel, path: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      model.read(path, {
        success: ({ results }: { results: T }) => resolve(results),
        error: (oError: { [propKey: string]: string }) => reject(oError),
      });
    });
  }

  onCheckboxFilterChange(oEvent: CheckBox$SelectEvent) {
    const tagName = oEvent.getSource().data('tagName') as string;
    const tagModel = (this.usedTagsModel.getData() as UITag[]).find((tag: UITag) => tag.name === tagName);
    tagModel.selected = oEvent.getParameter('selected');

    if (tagName === TAG_ALL) {
      (this.usedTagsModel.getData() as UITag[]).forEach((tag: UITag) => (tag.selected = tagModel.selected));
    }

    this.filterByTag();
  }

  private filterByTag() {
    const certificationListEl = this.getView().byId('certificationsList') as List;

    const selectedTags = (this.usedTagsModel.getData() as UITag[])
      .filter((tag: UITag) => tag.selected)
      .map((tag: UITag) => tag.name);

    var oFilter = new Filter({
      path: 'tags',

      test: function (oValue: string) {
        // no filtering required
        if (selectedTags.includes(TAG_ALL)) {
          return true;
        }

        // filter by tags
        const certificationTags = oValue.split(',');
        return certificationTags.some((certificationTag) => selectedTags.includes(certificationTag));
      },
    });

    (certificationListEl.getBinding('items') as JSONListBinding).filter(oFilter);
  }

  openLink(oEvent: Button$PressEvent) {
    const link = oEvent.getSource().data('link') as string;
    window.open(link, '_blank');
  }
}

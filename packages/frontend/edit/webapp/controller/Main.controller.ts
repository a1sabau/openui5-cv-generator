/* eslint-disable no-console */
import Controller from 'sap/ui/core/mvc/Controller';
import JSONModel from 'sap/ui/model/json/JSONModel';
import Event from 'sap/ui/base/Event';
import ODataModel from 'sap/ui/model/odata/v2/ODataModel';
import ResourceModel from 'sap/ui/model/resource/ResourceModel';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import SmartField from 'sap/ui/comp/smartfield/SmartField';
import MessageToast from 'sap/m/MessageToast';
import SmartForm from 'sap/ui/comp/smartform/SmartForm';
import { PhotoInput$ChangeEvent } from '../controls/PhotoInput';
import Context from 'sap/ui/model/Context';

/**
 * @namespace ui5.cv.edit.controller
 */

type Metadata = {
  term: string,
  extensions: {
    value: string
  }[],
  [key: string]: any,
}

export default class App extends Controller {
  stateModel: JSONModel;

  public onInit(): void {
    var oModel = this.getOwnerComponent().getModel() as ODataModel;

    // Attach an event handler for the metadataLoaded event
    oModel
      .metadataLoaded()
      .then(async () => {
        var oResourceBundle = await (this.getOwnerComponent().getModel('i18n') as ResourceModel).getResourceBundle();
        this.replaceLabelsFromI18n(oModel.getServiceMetadata() as Metadata, oResourceBundle);
      })
      .catch((oError) => {
        console.log('oError', oError);
      });

    /*
    using OData v2 as v4 is not supported by SmartForm
    ensure in manifest.json > model.settings > "defaultBindingMode": "TwoWay"
    */
    this.getView()?.bindElement({ path: '/Cv(1)' });

    // nav data model
    const navModel = new JSONModel('../model/side-navigation-data.json');
    this.getView().setModel(navModel, 'sideNavigation');

    // state model
    this.stateModel = new JSONModel({
      editMode: false,
    });
    this.getView().setModel(this.stateModel, 'state');
  }

  private replaceLabelsFromI18n(oMetadata: Metadata, i18nBundle: ResourceBundle): void {
    if (oMetadata?.term === 'Common.Label') {
      const i18nFullKey = oMetadata.extensions[0].value;
      if (/^i18n>/.test(i18nFullKey)) {
        const i18nKey = i18nFullKey.replace(/^i18n>/, '');
        const i18nValue = i18nBundle.getText(i18nKey);

        var oSmartField = this.byId(`smartField_${i18nKey}`) as SmartField;
        if (oSmartField) {
          oSmartField.setTextLabel(i18nValue);
        }
      }
    } else {
      for (var key in oMetadata) {
        if (typeof oMetadata[key] === 'object') {
          this.replaceLabelsFromI18n(oMetadata[key] as Metadata, i18nBundle);
        }
      }
    }
  }

  public handleEditPress(oEvent: Event): void {
    this.stateModel.setProperty('/editMode', true);
  }

  public async handleCancelPress(oEvent: Event): Promise<void> {
    var oModel = this.getView().getModel() as ODataModel;
    await oModel.resetChanges();
    this.stateModel.setProperty('/editMode', false);
  }

  public async handleSavePress() {
    /*
    OData v4 approach coupled with custom control FormRow triggering model change events on Input change
    use the updateGroupId specified in manifest.json to still have twoway binding
    but not send the changes to the server on each fired change event

    // make sure manifest.json > model.settings > updateGroupId matches
    await cvModel.submitBatch('myUpdateGroup');

    no longer using OData v4 as it is not supported by SmartForm
    */

    /* OData v2 approach */
    var oModel = this.getView().getModel() as ODataModel;
    var oSmartForm = this.byId('smartForm') as SmartForm;

    oSmartForm.getSmartFields().forEach((oSmartField) => {
      oSmartField.attachChange((oEvent: any) => {
        console.log('oSmartField change event', oEvent);
      });
    });

    // listen to change events reaching the oSmartForm
    oSmartForm.attachEvent('change', (oEvent: any) => {
      console.log('oSmartForm change event', oEvent);
    });

    // Trigger validation on the SmartForm
    const fieldErrors = await oSmartForm.check();
    if (fieldErrors.length > 0) {
      MessageToast.show('Validation Failed');
      return;
    }

    // Check if the model has pending changes
    if (oModel.hasPendingChanges(true)) {
      oModel.submitChanges({
        success: () => {
          MessageToast.show('Changes saved successfully');
          // Optionally, you can refresh the binding if needed
          oSmartForm.getElementBinding().refresh();
          this.stateModel.setProperty('/editMode', false);
        },
        error: (oError:Error) => {
          MessageToast.show(`Error saving changes ${oError.message}`);
        },
      });
    } else {
      MessageToast.show('No changes to save');
    }
  }

  private validateForm(oSmartForm: SmartForm) {
    /*
    var aFormElements = oSmartForm.getGroups().reduce(function (aElements, oGroup) {
      return aElements.concat(oGroup.getGroupElements());
    }, []);
    */

    var bFormIsValid = true;

    /*
    // Iterate through all form elements
    aFormElements.forEach(function (oFormElement) {
      var aFields = oFormElement.getFields();

      // Iterate through all fields in the form element
      aFields.forEach(function (oField: SmartField) {
        // Check if the field has a validateField method
        if (typeof oField.validateField === "function") {
          // Call the validateField method for custom validation
          oField.validateField();

          // Check the value state after validation
          if (oField.getValueState() === "Error") {
            bFormIsValid = false;
          }
        }
      });
    });
    */

    return bFormIsValid;
  }

  onModelContextChange(oEvent: Event) {
    console.log('onModelContextChange', oEvent);
  }

  async handlePhotoChange(oEvent: PhotoInput$ChangeEvent) {
    const oModel = this.getView().getModel() as ODataModel;
    const base64Img = oEvent.getParameter('value');

    const {contextCreated} = oModel.callFunction('/Cv_savePhoto', {
      method: 'POST',
      urlParameters: {
        ID: 1,
        photo: base64Img,
      },
    }) as { contextCreated: () => Promise<Context> };

    await contextCreated();
  }
}

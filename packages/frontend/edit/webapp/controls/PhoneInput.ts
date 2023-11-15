import type { MetadataOptions } from 'sap/ui/core/Element';
import Element from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import Text from 'sap/m/Text';
import JSONModel from 'sap/ui/model/json/JSONModel';
import Control from 'sap/ui/core/Control';
import { IFormContent } from 'sap/ui/core/library';
import HBox from 'sap/m/HBox';
import ListItem from 'sap/ui/core/ListItem';
import Form from 'sap/ui/layout/form/Form';
import ComboBox from 'sap/m/ComboBox';
import Input from 'sap/m/Input';

/**
 * @namespace ui5.cv.edit.controls
 */
export default class PhoneInput extends Control implements IFormContent {
  __implements__sap_ui_core_IFormContent: boolean;

  // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
  constructor(idOrSettings?: string | $PhoneInputSettings);
  constructor(id?: string, settings?: $PhoneInputSettings);
  constructor(id?: string, settings?: $PhoneInputSettings) {
    super(id, settings);
  }

  oCountriesModel: JSONModel;

  static readonly metadata: MetadataOptions = {
    interfaces: ['sap.ui.core.IFormContent'],
    properties: {
      phone: 'string',
      country: 'string',
      prefix: 'string',
    },
    aggregations: {
      _infoText: { type: 'sap.m.Text', multiple: false, visibility: 'hidden' },
    },
    associations: {
      _countryComboBox: { type: 'sap.m.ComboBox', multiple: false, visibility: 'hidden' },
      _prefixInput: { type: 'sap.m.Input', multiple: false, visibility: 'hidden' },
      _phoneInput: { type: 'sap.m.Input', multiple: false, visibility: 'hidden' },
    },
    events: {
      change: {
        parameters: {
          value: { type: 'string' },
        },
      },
    },
  };

  static renderer = {
    apiVersion: 2,
    render: function (oRm: RenderManager, oControl: PhoneInput) {
      // identify parent form
      let oParentForm = oControl.getParent();
      while (oParentForm !== undefined && oParentForm.getMetadata().getName() !== 'sap.ui.layout.form.Form') {
        oParentForm = oParentForm.getParent();
      }
      // get parent form editable status
      const editable = (oParentForm as Form)?.getEditable() ?? false;

      oRm.openStart('div', oControl).openEnd();

      if (!editable) {
        oControl.updateInfoText();
        oRm.renderControl(oControl.getAggregation('_infoText') as Text);
      } else {
        oControl.updatePrefixText();
        oControl.updateCountryComboBox();
        oControl.updatePhoneInput();

        oRm.renderControl(
          new HBox({
            items: [
              oControl.getAssociationEl<ComboBox>('_countryComboBox'),
              oControl.getAssociationEl<Input>('_prefixInput'),
              oControl.getAssociationEl<Input>('_phoneInput'),
            ],
          })
        );
      }

      oRm.close('div');
    },
  };

  async init() {
    this.oCountriesModel = new JSONModel();

    this.setAggregation('_infoText', new Text());
    this.setAssociation('_prefixInput', new Input({ editable: false, enabled: false, width: '3rem' }));
    this.setAssociation(
      '_countryComboBox',
      new ComboBox({
        models: { undefined: this.oCountriesModel },
        showSecondaryValues: true,
        items: {
          path: '/',
          template: new ListItem({
            text: {
              parts: ['name', 'prefix'],
              formatter: function (name: string, prefix: string) {
                return `${name}`;
              },
            },
            additionalText: '{prefix}',
            key: '{code}',
          }),
        },
        selectionChange: this.onCountryChange.bind(this),
      })
    );
    this.setAssociation(
      '_phoneInput',
      new Input({
        change: this.onPhoneChange.bind(this),
        liveChange: this.onPhoneChange.bind(this),
      })
    );

    await this.loadJSONModels();

    // re-invoked setter now that the country prefixes have been loaded to generate the prefix
    this.setCountry(this.getCountry());
  }

  private setCountry(country: string) {
    this.setProperty('country', country, true);

    // countries model has been loaded, we can lookup the prefix
    if (Array.isArray(this.oCountriesModel.getData())) {
      const oCountry = this.oCountriesModel.getData().find((entry: any) => entry.code === country);
      this.setPrefix(oCountry?.prefix || '-');
    }
  }

  private updateInfoText() {
    let sInfo = `${this.getCountry()} +${this.getPrefix()} ${this.getPhone()}`;
    // some prefixes already come with a '+' sign, make sure we don't have multiple occurences of it
    sInfo = sInfo.replace(/\++/g, '+');

    (this.getAggregation('_infoText') as Text).setText(sInfo);
  }

  private updatePrefixText() {
    const prefixEl = this.getAssociationEl<Input>('_prefixInput');
    if (prefixEl) {
      prefixEl.setValue(`+${this.getPrefix()}`);
    }
  }

  private updateCountryComboBox() {
    const countryEl = this.getAssociationEl<ComboBox>('_countryComboBox');
    if (countryEl) {
      countryEl.setSelectedKey(this.getCountry());
    }
  }

  private updatePhoneInput() {
    const phoneEl = this.getAssociationEl<Input>('_phoneInput');
    if (phoneEl) {
      phoneEl.setValue(this.getPhone());
    }
  }

  private getAssociationEl<T>(sAssociationName: string): T {
    const sAssociationId = this.getAssociation(sAssociationName, null) as string;
    return sAssociationId ? (Element.getElementById(sAssociationId) as T) : null;
  }

  private async loadJSONModels() {
    const oCountryNamesModel = new JSONModel();
    await oCountryNamesModel.loadData('../model/country-names.json');
    const mCountryNames: { [key: string]: string } = oCountryNamesModel.getData();

    const oCountryPhoneCodesModel = new JSONModel();
    await oCountryPhoneCodesModel.loadData('../model/country-phone-codes.json');
    const mCountryPhoneCodes: { [key: string]: string } = oCountryPhoneCodesModel.getData();

    const aCountries = Object.keys(mCountryNames)
      .map((countryKey) => ({
        code: countryKey,
        prefix: mCountryPhoneCodes[countryKey],
        name: mCountryNames[countryKey],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    this.oCountriesModel.setSizeLimit(500);
    this.oCountriesModel.setData(aCountries);
  }

  private onCountryChange(oEvent: any) {
    const value = oEvent.getParameter('selectedItem').getKey();
    const oCountry = this.oCountriesModel.getData().find((entry: any) => entry.code === value);
    this.setCountry(oCountry.code);
    this.fireEvent('change', { value });
  }

  private onPhoneChange(oEvent: any) {
    const value = oEvent.getParameter('value');
    this.setProperty('phone', value, true);
    this.fireEvent('change', { value });
  }
}

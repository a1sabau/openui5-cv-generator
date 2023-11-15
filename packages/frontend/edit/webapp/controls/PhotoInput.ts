import type { MetadataOptions } from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import Control from 'sap/ui/core/Control';
import { IFormContent } from 'sap/ui/core/library';
import Form from 'sap/ui/layout/form/Form';
import Button from 'sap/m/Button';
import FileUploader, { FileUploader$ChangeEvent } from 'sap/ui/unified/FileUploader';
import Avatar from 'sap/m/Avatar';

/**
 * @namespace ui5.cv.edit.controls
 */
export default class PhotoInput extends Control implements IFormContent {
  __implements__sap_ui_core_IFormContent: boolean;

  // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
  constructor(idOrSettings?: string | $PhotoInputSettings);
  constructor(id?: string, settings?: $PhotoInputSettings);
  constructor(id?: string, settings?: $PhotoInputSettings) {
    super(id, settings);
  }

  static readonly metadata: MetadataOptions = {
    interfaces: ['sap.ui.core.IFormContent'],
    properties: {
      photoSrc: 'string',
    },
    aggregations: {
      _fileUploader: { type: 'sap.ui.unified.FileUploader', multiple: false, visibility: 'hidden' },
      _avatar: { type: 'sap.m.Avatar', multiple: false, visibility: 'hidden' },
    },
    associations: {},
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
    render: function (oRm: RenderManager, oControl: PhotoInput) {
      // identify parent form
      let oParentForm = oControl.getParent();
      while (oParentForm !== undefined && oParentForm.getMetadata().getName() !== 'sap.ui.layout.form.Form') {
        oParentForm = oParentForm.getParent();
      }
      // get parent form editable status
      const editable = (oParentForm as Form)?.getEditable() ?? false;

      oRm.openStart('div', oControl).openEnd();

      oRm.renderControl(oControl.getAggregation('_avatar') as Avatar);

      if (!editable) {
        oRm.renderControl(oControl.getAggregation('_fileUploader') as Button);
      } else {
        oRm.renderControl(oControl.getAggregation('_fileUploader') as Button);
      }

      oRm.close('div');
    },
  };

  init() {
    this.setAggregation(
      '_fileUploader',
      new FileUploader({
        name: 'photo',
        uploadOnChange: false,
        change: this.onFilePathChange.bind(this),
        fileType: ['png'],
        buttonText: 'Browse',
        buttonOnly: true,
        icon: 'sap-icon://upload',
      })
    );

    this.setAggregation(
      '_avatar',
      new Avatar({
        displaySize: 'XL',
        initials: 'AA',
        src: this.getPhotoSrc(),
      })
    );
  }

  setPhotoSrc(photoSrc: string) {
    this.setProperty('photoSrc', photoSrc);
    (this.getAggregation('_avatar') as Avatar).setSrc(photoSrc);
  }

  private onFilePathChange(oEvent: FileUploader$ChangeEvent) {
    const arrFiles: FileList = oEvent.getParameter('files') as any;
    const oFile = arrFiles[0];
    const sPreviewPath = URL.createObjectURL(oFile);

    (this.getAggregation('_avatar') as Avatar).setSrc(sPreviewPath);

    var oReader = new FileReader();
    oReader.onload = () => {
      /*
      reader.result:
          base64 encoded content (due to readAsDataURL) as required by CAP
          https://cap.cloud.sap/docs/guides/media-data#general-conventions
      */

      // remove the Data-URL declaration preceding the Base64-encoded data
      const sBase64Img = (oReader.result as string).replace(/.+base64,/, '');

      this.fireEvent('change', { value: sBase64Img });
    };
    oReader.readAsDataURL(oFile);
  }
}

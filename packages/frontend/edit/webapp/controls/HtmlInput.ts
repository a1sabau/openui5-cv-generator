import type { MetadataOptions } from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import HTML from 'sap/ui/core/HTML';
import RichTextEditor, { RichTextEditor$ChangeEvent } from 'sap/ui/richtexteditor/RichTextEditor';
import Control from 'sap/ui/core/Control';
import { IFormContent } from 'sap/ui/core/library';
import Form from 'sap/ui/layout/form/Form';

/**
 * @namespace ui5.cv.edit.controls
 */
export default class HtmlInput extends Control implements IFormContent {
  __implements__sap_ui_core_IFormContent: boolean;

  // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
  constructor(idOrSettings?: string | $HtmlInputSettings);
  constructor(id?: string, settings?: $HtmlInputSettings);
  constructor(id?: string, settings?: $HtmlInputSettings) {
    super(id, settings);
  }

  static readonly metadata: MetadataOptions = {
    interfaces: ['sap.ui.core.IFormContent'],
    properties: {
      content: 'string',
    },
    aggregations: {
      _htmlViewer: { type: 'sap.ui.core.HTML', multiple: false, visibility: 'hidden' },
      _richTextEditor: { type: 'sap.ui.richtexteditor.RichTextEditor', multiple: false, visibility: 'hidden' },
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
    render: function (oRm: RenderManager, oControl: HtmlInput) {
      // identify parent form
      let oParentForm = oControl.getParent();
      while (oParentForm !== undefined && oParentForm.getMetadata().getName() !== 'sap.ui.layout.form.Form') {
        oParentForm = oParentForm.getParent();
      }
      // get parent form editable status
      const bEditable = (oParentForm as Form)?.getEditable() ?? false;

      oRm.openStart('div', oControl).class('ui5_cv_spacious').openEnd();

      if (!bEditable) {
        oRm.renderControl(oControl.getAggregation('_htmlViewer') as HTML);
      } else {
        oRm.renderControl(oControl.getAggregation('_richTextEditor') as RichTextEditor);
      }
      oRm.close('div');
    },
  };

  init() {
    this.setAggregation('_htmlViewer', new HTML({ sanitizeContent: false }));

    this.onEditorChange = this.onEditorChange.bind(this);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const rte = new RichTextEditor({ change: this.onEditorChange });
    rte.addStyleClass('ui5_cv_rte');
    this.setAggregation('_richTextEditor', rte);
  }

  setContent(content: string) {
    (this.getAggregation('_htmlViewer') as HTML).setContent(content);
    (this.getAggregation('_richTextEditor') as RichTextEditor).setValue(content);
    this.setProperty('content', content);
  }

  private onEditorChange(oEvent: RichTextEditor$ChangeEvent) {
    var sNewValue = oEvent.getParameter('newValue');
    this.setContent(sNewValue);
    this.fireEvent('change', { value: sNewValue });
  }

  exit() {
    this.eventCleanup();
  }

  private eventCleanup() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    (this.getAggregation('_richTextEditor') as RichTextEditor).detachChange(this.onEditorChange);
  }
}

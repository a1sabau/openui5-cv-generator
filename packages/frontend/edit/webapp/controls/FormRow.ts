import type { MetadataOptions } from 'sap/ui/core/Element';
import RenderManager from 'sap/ui/core/RenderManager';
import Control from 'sap/ui/core/Control';
import Label from 'sap/m/Label';
import Text from 'sap/m/Text';
import Input from 'sap/m/Input';

/**
 * Responsible for rendering a row in a form containing:
 * - a label and text in case the control is not editable
 * - a label and input field in case the control is editable
 *
 * It provides some of the functionality of SmartField.
 * @namespace ui5.cv.display.controls
 */
export default class FormRow extends Control {
  // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
  constructor(idOrSettings?: string | $FormRowSettings);
  constructor(id?: string, settings?: $FormRowSettings);
  constructor(id?: string, settings?: $FormRowSettings) {
    super(id, settings);
  }

  static readonly metadata: MetadataOptions = {
    properties: {
      label: 'string',
      editable: { type: 'boolean', defaultValue: false },
      value: 'string',
    },
    aggregations: {
      _label: { type: 'sap.m.Label', multiple: false, visibility: 'hidden' },
      _input: { type: 'sap.m.Input', multiple: false, visibility: 'hidden' },
      _text: { type: 'sap.m.Text', multiple: false, visibility: 'hidden' },
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
    render: function (oRm: RenderManager, oControl: FormRow) {
      oRm.openStart('div', oControl);
      oRm.openEnd();

      oRm.renderControl(oControl.getAggregation('_label') as Label);

      if (!oControl.getEditable) {
        oRm.renderControl(oControl.getAggregation('_text') as Text);
      } else {
        oRm.renderControl(oControl.getAggregation('_input') as Input);
      }

      oRm.close('div');
    },
  };

  init() {
    this.setAggregation('_label', new Label({}));
    this.setAggregation('_input', new Input({}));
    this.setAggregation('_text', new Text({}));

    this.inputEventHandler = this.inputEventHandler.bind(this);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    (this.getAggregation('_input') as Input).getDomRef().addEventListener('input', this.inputEventHandler);
  }

  setValue(sValue: string) {
    (this.getAggregation('_input') as Input).setValue(sValue);
    (this.getAggregation('_text') as Text).setText(sValue);

    // no need to invalidate the control as the value originates from the input field itself
    this.setProperty('value', sValue, true);
  }

  private inputEventHandler(oEvent: Event): void {
    const sValue = (oEvent.target as HTMLInputElement).value;
    this.setValue(sValue);
    this.fireEvent('change', { value: sValue });
  }

  exit() {
    this.inputEventHandlerCleanup();
  }

  private inputEventHandlerCleanup() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    (this.getAggregation('_input') as Input).getDomRef().removeEventListener('input', this.inputEventHandler);
  }
}

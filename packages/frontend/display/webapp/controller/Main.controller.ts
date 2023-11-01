import { URLHelper } from 'sap/m/library';
import BaseController from './BaseController';

/**
 * @namespace ui5.cv.controller
 */
export default class Main extends BaseController {
  public onInit(): void {
    this.getView()?.bindElement({ path: '/Cv(1)' });
  }

  public switchToNextjsCV(): void {
    URLHelper.redirect('/');
  }
}

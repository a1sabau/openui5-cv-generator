import MessageBox from 'sap/m/MessageBox'
import BaseController from './BaseController'
import ODataModel from 'sap/ui/model/odata/v4/ODataModel'
import Log from 'sap/base/Log'
import MockServer from 'sap/ui/core/util/MockServer'

/**
 * @namespace ui5.cv.controller
 */
export default class Main extends BaseController {
  public onInit(): void {
    this.getView()?.bindElement({ path: `/Cv(1)` })
  }

  public switchToNextjsCV(): void {
    window.location.href = '/'
  }
}

import BaseController from './BaseController';
import MockServer from 'sap/ui/core/util/MockServer';
import Log from 'sap/base/Log';

/**
 * @namespace ui5.cv.display.controller
 */
export default class App extends BaseController {
  public onInit(): void {
    // apply content density mode to root view
    this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
  }

  public runMockServer(): void {
    // create
    var oMockServer = new MockServer({
      rootUri: '/browse/',
    });

    // simulate against the metadata and mock data
    oMockServer.simulate('../localService/metadata.xml', {
      sMockdataBaseUrl: '../localService/mockdata',
      bGenerateMissingMockData: true,
    });

    // start
    oMockServer.start();

    Log.info('Running the app with mock data');
  }
}

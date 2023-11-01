import Log from 'sap/base/Log';
import MockServer from 'sap/ui/core/util/MockServer';

const enableMockServer = false;

if (enableMockServer) {
  // create
  var oMockServer = new MockServer({
    rootUri: '/browse/',
  });

  // simulate against the metadata and mock data
  oMockServer.simulate('./localService/metadata.xml', {
    sMockdataBaseUrl: './localService/mockdata',
    bGenerateMissingMockData: true,
  });

  // start
  oMockServer.start();

  Log.info('Running the app with mock data');
}

// initialize the embedded component on the HTML page
sap.ui.require(['sap/ui/core/ComponentSupport']);

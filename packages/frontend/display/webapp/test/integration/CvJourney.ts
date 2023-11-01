/* eslint-disable @typescript-eslint/no-floating-promises */
import opaTest from 'sap/ui/test/opaQunit';
import MainPage from './pages/MainPage';

const onTheMainPage = new MainPage();

QUnit.module('CV Journey');

opaTest('Header', function () {
  // Arrangements
  onTheMainPage.iStartMyUIComponent({
    componentConfig: {
      name: 'ui5.cv.display',
    },
  });

  // Assertions
  onTheMainPage.iShouldSeeTheAvatar();

  // Cleanup
  onTheMainPage.iTeardownMyApp();
});

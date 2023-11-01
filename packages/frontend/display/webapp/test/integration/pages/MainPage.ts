import Opa5 from 'sap/ui/test/Opa5';

const viewName = 'ui5.cv.view.Main';

export default class MainPage extends Opa5 {
  iShouldSeeTheAvatar() {
    this.waitFor({
      controlType: 'sap.m.Avatar',
      viewName,
      success: function () {
        Opa5.assert.ok(true, 'Avatar is visible');
      },
      errorMessage: 'Did not find avatar',
    });
  }
}

import Controller from 'sap/ui/core/mvc/Controller';
import AppComponent from '../Component';

/**
 * @namespace ui5.cv.edit.controller
 */
export default class App extends Controller {
  public onInit(): void {
    // apply content density mode to root view
    this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());
  }
}

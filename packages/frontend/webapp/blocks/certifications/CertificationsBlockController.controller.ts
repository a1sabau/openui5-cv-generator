// sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function (Controller, MessageToast) {
// 	"use strict";

import MessageToast from 'sap/m/MessageToast'
import Controller from 'sap/ui/core/mvc/Controller'

export default Controller.extend('ui5.cv.blocks.certifications.CertificationsBlockController', {
  openLink(oEvent: any) {
    const link = oEvent.getSource().data('link')
    window.open(link, '_blank')
  },

  onInit: function () {
    console.log('CertificationsBlockController onInit')
    // this.getView()?.bindElement({ path: `/Cv` });
  },

  onBtnPress: function () {
    MessageToast.show('Button was presed')
  },

  onParentBlockModeChange: function (oEvent: any) {
    console.log('onParentBlockModeChange', oEvent)
  },
})
// });

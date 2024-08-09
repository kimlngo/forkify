import * as Constant from '../constant.js';
import { HOME_PAGE } from '../config.js';
class LogoView {
  _parentElement = document.querySelector('.header__logo');

  addHandlerClick() {
    this._parentElement.addEventListener(Constant.CLICK, function (e) {
      window.location = HOME_PAGE;
    });
  }
}

export default new LogoView();

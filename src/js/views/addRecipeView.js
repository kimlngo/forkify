import View from './View.js';

import * as Constant from '../constant.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _defaultSuccessMsg = 'Recipe was successfully uploaded!';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle(Constant.HIDDEN_CLASS);
    this._window.classList.toggle(Constant.HIDDEN_CLASS);
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      Constant.CLICK,
      this.toggleWindow.bind(this)
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener(
      Constant.CLICK,
      this.toggleWindow.bind(this)
    );
    this._overlay.addEventListener(
      Constant.CLICK,
      this.toggleWindow.bind(this)
    );
  }

  addHandlerUpload(handlerFn) {
    this._parentElement.addEventListener(Constant.SUBMIT, function (e) {
      e.preventDefault();

      //get all inputs
      //the this keyword in here is referring to this._parentElement
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handlerFn(data);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();

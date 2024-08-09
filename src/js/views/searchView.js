import * as Constant from '../constant.js';

class SearchView {
  _parentElement = document.querySelector(Constant.SEARCH);

  getQuery() {
    const query = this._parentElement.querySelector(
      Constant.SEARCH_FIELD
    ).value;
    this._clearInput();

    return query;
  }

  _clearInput() {
    this._parentElement.querySelector(Constant.SEARCH_FIELD).value = '';
  }

  addHandlerSearch(handlerFn) {
    //Here, we don't query for the button then attach the handler but we directly add the event listener on the parent (using Event bubbling). The trigger event is submit so it works with both button click and hit enter key
    this._parentElement.addEventListener(Constant.SUBMIT, function (e) {
      e.preventDefault();
      handlerFn();
    });
  }
}

export default new SearchView();

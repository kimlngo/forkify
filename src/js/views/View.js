//export default the class, we're not going to create any instance of the View, but just import and extends this view for child classes
import icons from 'url:../../img/icons.svg'; //parcel 2
import * as Constant from '../constant.js';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g., recipe)
   * @returns
   * @this {Object} View instance
   * @author Kim Long Ngo
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML(Constant.AFTER_BEGIN, markup);
  }

  _clear() {
    //clear the existing content of parent element for new incoming content
    this._parentElement.innerHTML = Constant.EMPTY_STR;
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        //check if element is text-only
        newEl.firstChild?.nodeValue.trim() !== Constant.EMPTY_STR
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        //copy over attributes
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  renderSpinner() {
    const html = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML(Constant.AFTER_BEGIN, html);
  }

  renderError(errorMsg = this._defaultErrorMsg) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${errorMsg}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML(Constant.AFTER_BEGIN, markup);
  }

  renderMessage(message = this._defaultSuccessMsg) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML(Constant.AFTER_BEGIN, markup);
  }
}

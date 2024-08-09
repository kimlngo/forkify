import View from './View.js';
import icons from 'url:../../img/icons.svg'; //parcel 2
import * as Constant from '../constant.js';
import { TOP_SCROLLING } from '../config.js';

/**
 * this._data is referring to model.state.search
 * {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RESULT_PER_PAGE,
    }
 */
class PaginationView extends View {
  _parentElement = document.querySelector(Constant.PAGINATION);

  addHandlerClick(handlerFn) {
    //add event listener on the upper DOM element and use .closest to find the button with class btn--inline. Because user can click on the button, or the span or the svg.
    this._parentElement.addEventListener(Constant.CLICK, function (e) {
      const btn = e.target.closest(Constant.BTN_INLINE);

      //guard
      if (!btn) return;

      window.scrollTo(TOP_SCROLLING);

      const goToPage = Number(btn.dataset.goto);
      handlerFn(goToPage);
    });
  }
  _generateMarkup() {
    //retrieve the current page
    const curPage = this._data.page;
    //calc the number of pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `${this._generateNextBtnMarkup(curPage)}`;
    }

    //Last Page
    if (curPage === numPages && numPages > 1) {
      return `${this._generatePreBtnMarkup(curPage)}`;
    }
    //Other Page
    if (curPage < numPages) {
      return `${this._generatePreBtnMarkup(curPage)}
              ${this._generateNextBtnMarkup(curPage)}`;
    }

    //Page 1, and there are NO other pages. Nothing to return
    return '';
  }

  _generatePreBtnMarkup(curPage) {
    //prettier-ignore
    return `
    <button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
    </button>
  `;
  }

  _generateNextBtnMarkup(curPage) {
    //prettier-ignore
    return `
    <button class="btn--inline pagination__btn--next" data-goto="${curPage + 1}">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
  `;
  }
}

export default new PaginationView();

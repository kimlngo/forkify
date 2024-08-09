import View from './View.js';
import icons from 'url:../../img/icons.svg'; //parcel 2
import { PREVIEW_LINK_ACTIVE } from '../constant.js';

export default class PreviewView extends View {
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(entry) {
    const activeId = window.location.hash.slice(1); //get the id from the hash
    const linkActive = activeId === entry.id ? PREVIEW_LINK_ACTIVE : '';
    const iconUser = entry.key ? '' : 'hidden';
    return `
    <li class="preview">
        <a class="preview__link ${linkActive}" href="#${entry.id}">
            <figure class="preview__fig">
            <img src="${entry.image}" alt="${entry.title}" />
            </figure>
            <div class="preview__data">
            <h4 class="preview__title">${entry.title}</h4>
            <p class="preview__publisher">${entry.publisher}</p>
              <div class="preview__user-generated ${iconUser}">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
        </a>
    </li>`;
  }
}

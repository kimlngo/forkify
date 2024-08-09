import previewView from './previewView';
import { LOAD } from '../constant.js';

class BookmarksView extends previewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _defaultErrorMsg = 'No bookmarks yet. Find a nice recipe and bookmark it!';
  _defaultSuccessMsg = '';

  addRenderHandler(handlerFn) {
    window.addEventListener(LOAD, handlerFn);
  }
}

export default new BookmarksView();

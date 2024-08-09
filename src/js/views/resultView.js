import PreviewView from './previewView.js';

class ResultView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _defaultErrorMsg = 'No recipes found for your query! Please try again';
  _defaultSuccessMsg = '';
}

export default new ResultView();

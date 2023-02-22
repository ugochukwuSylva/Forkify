import icons from 'url:../../img/icons.svg';
import { parentView } from './parentView.js';
import resultBookParentView from './resultBookParentView.js';

class resultView extends parentView {
  _parentContainer = document.querySelector('.results');
  _errorMessage = 'No recipe found for this query. Please try again!';
  _message = '';

  _generateHtml() {
    return this._data
      .map(result => resultBookParentView.renderHtml(result, false))
      .join('');
  }
}

export default new resultView();

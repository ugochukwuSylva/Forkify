import icons from 'url:../../img/icons.svg';
import { parentView } from './parentView.js';
import resultBookParentView from './resultBookParentView.js';

class bookmarkView extends parentView {
  _parentContainer = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmark yet. Find a nice recipe and bookmark it...';
  _message = '';

  addHandlerStoreBookmark(handler) {
    window.addEventListener('load', handler);
  }

  _generateHtml() {
    return this._data
      .map(bookmark => resultBookParentView.renderHtml(bookmark, false))
      .join('');
  }
}

export default new bookmarkView();

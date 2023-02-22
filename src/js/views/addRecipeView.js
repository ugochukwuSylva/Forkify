import icons from 'url:../../img/icons.svg';
import { parentView } from './parentView.js';

class AddRecipeView extends parentView {
  _parentContainer = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _SuccessMessage = 'Recipe uploaded successfully';

  constructor() {
    super();
    this._addHandlerOpenWindow();
    this._addHandlerCloseWindow();
  }

  addHandlerSubmitRecipe(handler) {
    this._parentContainer.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerOpenWindow() {
    const btnOpen = document.querySelector('.nav__btn--add-recipe');
    btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    const btnClose = document.querySelector('.btn--close-modal');
    btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _generateHtml() {}
}

export default new AddRecipeView();

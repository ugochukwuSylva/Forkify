import icons from 'url:../../img/icons.svg';

import { parentView } from './parentView.js';

class paginationView extends parentView {
  _parentContainer = document.querySelector('.pagination');

  _generateHtml() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPages
    );
    // first page and other pages
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto='${
        curPage + 1
      }' class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }
    // last page
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto='${
        curPage - 1
      }' class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
     </button>
      `;
    }

    //other pages
    if (curPage > 1) {
      return `
      <button data-goto='${
        curPage - 1
      }' class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
     </button>

     <button data-goto='${
       curPage + 1
     }' class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }
    return '';
  }

  renderListnerEvent(handler) {
    this._parentContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goTo = +btn.dataset.goto;

      handler(goTo);
    });
  }
}

export default new paginationView();

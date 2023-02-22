import icons from 'url:../../img/icons.svg';

export class parentView {
  _data;

  renderHtml(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMsg();
    this._data = data;
    const markup = this._generateHtml();
    if (!render) return markup;

    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentContainer.textContent = '';
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateHtml();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentContainer.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const markup = `
         <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
      `;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }
  renderErrorMsg(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccessMsg(message = this._SuccessMessage) {
    const markup = `
      <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }
}

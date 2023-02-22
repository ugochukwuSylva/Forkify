import * as model from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView';
import { async } from 'regenerator-runtime';
import searchView from './views/searchView';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controllerRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultView.update(model.loadPage());

    await model.loadRecipe(id);

    recipeView.renderHtml(model.state.recipe);
    bookmarkView.update(model.state.bookmarks);
    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMsg();
  }
};

const controllerSearchResult = async function () {
  resultView.renderSpinner();
  const query = searchView.getQuery();
  await model.loadSearchResult(query);
  if (!query) return;
  console.log(query);

  // resultView.renderHtml(model.state.search.result);
  resultView.renderHtml(model.loadPage());
  paginationView.renderHtml(model.state.search);
  console.log(model.state.search.result);
};

const loadPagePreview = function (gotoPage) {
  resultView.renderHtml(model.loadPage(gotoPage));

  paginationView.renderHtml(model.state.search);
};

const controllerServings = function (updateServings) {
  //update servings
  model.updateServings(updateServings);

  //update recipe view
  // recipeView.renderHtml(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe);
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmark view
  bookmarkView.renderHtml(model.state.bookmarks);
};

const bookmarkStorage = function () {
  bookmarkView.renderHtml(model.state.bookmarks);
};

const controlSubmitrecipe = async function (newRecipe) {
  try {
    // Render loading spinner
    addRecipeView.renderSpinner();

    console.log(newRecipe);
    await model.uploadRecipe(newRecipe);

    //Render recipe view
    recipeView.renderHtml(model.state.recipe);

    //success message
    addRecipeView.renderSuccessMsg();

    // Render bookmark view
    bookmarkView.renderHtml(model.state.bookmarks);

    // change url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close modal window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    console.log(model.state.recipe);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderErrorMsg(err.message);
  }
};

const welcomeMsg = function () {
  console.log('Welcome!');
};

const init = function () {
  bookmarkView.addHandlerStoreBookmark(bookmarkStorage);
  recipeView.renderListnerEvent(controllerRecipe);
  recipeView.addHandlerServings(controllerServings);
  recipeView.addHandlerBookkmark(controlBookmark);
  searchView.renderListnerEvent(controllerSearchResult);
  paginationView.renderListnerEvent(loadPagePreview);
  addRecipeView.addHandlerSubmitRecipe(controlSubmitrecipe);
  welcomeMsg();
};
init();

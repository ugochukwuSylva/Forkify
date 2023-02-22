import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    result: [],
    query: '',
    page: 1,
    resultPages: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createObject = function (data) {
  const { recipe } = data.data;

  return {
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    imageUrl: recipe.image_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        imageUrl: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const loadPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPages;
  const end = page * state.search.resultPages;

  return state.search.result.slice(start, end);
};

export const updateServings = function (Servings) {
  state.recipe.ingredients.forEach(ing => {
    // new servings //newQt = oldQt * newServings / oldServings
    ing.quantity = (ing.quantity * Servings) / state.recipe.servings;
  });
  state.recipe.servings = Servings;
};

const storeBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  storeBookmark();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);

  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  storeBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearStorage = function () {
  localStorage.clear('bookmark');
};
// clearStorage();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong format, Please use the correct ingredient format'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      title: newRecipe.title,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

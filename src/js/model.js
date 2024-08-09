import { API_URL, API_KEY, RESULT_PER_PAGE } from './config.js';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX, convertToHTTPS } from './helper.js';
import * as Constant from './constant.js';
// import { create } from 'core-js/core/object';

//Local constants
const BOOKMAKRS = 'bookmarks';
const ADD_BOOKMARKS_ERROR =
  "Wong format. Please follow: 'Quantity,Unit,Description'";
const INGREDIENTS = 'ingredient';

//Model state
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

//Model methods
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObj(data);

    //set bookmarked flag
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

const createRecipeObj = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    image: convertToHTTPS(recipe.image_url),
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: convertToHTTPS(recipe.source_url),
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.query = query;
    state.search.page = Constant.PAGE_ONE;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: convertToHTTPS(recipe.image_url),
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  //page is 1-index whereas start and endIndex are 0-based.
  state.search.page = page;
  const startIndex = (page - 1) * state.search.resultsPerPage;
  const endIndex = page * state.search.resultsPerPage;

  return state.search.results.slice(startIndex, endIndex);
};

export const updateServings = function (newServing) {
  const ratio = newServing / state.recipe.servings;

  //update serving
  state.recipe.servings = newServing;

  //update the quantity in each ingredients
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= ratio;
  });
};

const init = function () {
  const localBookmarks = JSON.parse(localStorage.getItem(BOOKMAKRS));
  if (localBookmarks) state.bookmarks = localBookmarks;
};

const persistBookmarks = function () {
  localStorage.setItem(BOOKMAKRS, JSON.stringify(state.bookmarks));
};

export const addBookmark = function (rep) {
  //Add bookmark
  state.bookmarks.push(rep);

  //Mark the current recipe as bookmarked
  if (rep.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

//only need the id to delete a the bookmarked
export const deleteBookmark = function (deleteId) {
  //delete bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === deleteId);

  //guard clause, should not happen
  if (index === -1) return;

  state.bookmarks.splice(index, 1);

  //mark the current recipe as NOT bookmarked
  if (deleteId === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        entry =>
          entry[0].startsWith(INGREDIENTS) && entry[1] !== Constant.EMPTY_STR
      )
      .map(entry => {
        const splitData = splitIngredientStr(entry[1]);

        if (splitData.length !== 3) throw new Error(ADD_BOOKMARKS_ERROR);

        const [quantity, unit, description] = splitData;
        return {
          quantity: formatIngrQuantity(quantity),
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: Number(newRecipe.cookingTime),
      servings: Number(newRecipe.servings),
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObj(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const splitIngredientStr = function (input) {
  return input
    .trim()
    .split(',')
    .map(str => str.trim());
};

const formatIngrQuantity = function (quantity) {
  return quantity ? Number(quantity) : null;
};

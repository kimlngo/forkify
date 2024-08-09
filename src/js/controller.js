import * as model from './model.js';
import * as Constant from './constant.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import logoView from './views/logoView.js';
import resultsView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    //guard clause
    if (!id) return;
    recipeView.renderSpinner();

    //0) Update results view to mark the selected result
    resultsView.update(model.getSearchResultPage());

    //1)Update bookmark view
    bookmarksView.update(model.state.bookmarks);

    //2) Load the recipe
    await model.loadRecipe(id);

    //3)Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1)Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)Load search results
    await model.loadSearchResults(query);

    //3)Render results
    resultsView.render(model.getSearchResultPage(Constant.PAGE_ONE));

    //4)Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //1)Render NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  //2)Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  //1) update recipe servings (in state)
  model.updateServings(newServing);

  //2) update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1)Add bookmark if not yet done, else remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2)Update recipe view
  recipeView.update(model.state.recipe);

  //3)Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlRenderBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload new recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();
    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);

    //Refresh the bookmarks render
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

//pub-sub implementation
const init = function () {
  bookmarksView.addRenderHandler(controlRenderBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  logoView.addHandlerClick();
};

init();

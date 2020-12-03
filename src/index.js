import './styles.css';
import debounce from 'lodash.debounce';
import imagesCardTpl from './templates/photo-card.hbs';
import PixabayApiService from './js/APIService';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/BrightTheme.css';
//import * as basicLightbox from 'basiclightbox';


export const myPnotify = title => error({ title, delay: 2000 }, 200);

const refs = {
  form: document.querySelector ('#search-form'),
  input: document.querySelector('#search-form input'),
  outputList: document.querySelector('.gallery'),
  watcher: document.querySelector('.watcher'),
};

const pixabayApiService = new PixabayApiService();

refs.input.addEventListener('input', debounce(onSearchInputChange, 1000));
refs.outputList.addEventListener('click', onClickImage);

function onSearchInputChange({ target }) {
  pixabayApiService.query = target.value;
  if (pixabayApiService.query === '') {
    clearArticlesList();
    return;
  }

  clearArticlesList();
  pixabayApiService.resetPage();
  fetchToPixabayApiAndRender();
}

function fetchToPixabayApiAndRender() {
  pixabayApiService.fetchImages().then(appendImagesMarkup);
}

function appendImagesMarkup({ hits }) {
  refs.outputList.insertAdjacentHTML('beforeend', imagesCardTpl(hits));
}

function clearArticlesList() {
  refs.outputList.innerHTML = '';
}

const intersectionCallback = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && pixabayApiService.query !== '') {
      fetchToPixabayApiAndRender();
    }
  });
};

const intersectionOptions = {
  rootMargin: '0% 0% 50% 0%',
};

const observer = new IntersectionObserver(
  intersectionCallback,
  intersectionOptions,
);

observer.observe(refs.watcher);

function onClickImage({ target: { dataset } }) {
    basicLightbox
      .create(
        `<img width="" height="" alt= "" src="${dataset.sourse}">
    `,
      )
      .show();
  }

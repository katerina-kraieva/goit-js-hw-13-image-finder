
const API_KEY = '19376133-18e6dc3507064954324c531a9';
const BASE_URL = 'https://pixabay.com/api/';

const perPage = 12;

import { myPnotify } from '../index';
export default class PixabayApiService {
    constructor() {
      this.searchQuery = '';
      this.page = 1;
    }
  
    async fetchImages() {
      try {
          const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=${perPage}&key=${API_KEY}`;
          const resultFetch = await fetch(url).then(res => res.json());

      this.incrementPage();

      if (resultFetch.total === 0) {
        myPnotify('Not Found. Please try again');
        return [];
      }

      return resultFetch;
    } catch (error) {
      myPnotify('Imges is ended');
      console.log(error);
      return error;
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
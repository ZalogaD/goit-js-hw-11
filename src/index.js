import {getData} from './js/PixabyApi';
import {createMarkup} from './js/markup';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const API_KEY = '35194171-84f1d5f9b415a31c1af013b41';
const PER_PAGE = 40;

let page = 1;
let value = '';

searchForm.addEventListener('submit', onSubmit);
loadBtn.addEventListener('click', onClick);

const searchForm = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtn = document.querySelector('.btn-load-more');
const lightbox = new SimpleLightbox('.gallery a', {});

async function onSubmit(event) {
  try {
    event.preventDefault();
    value = event.target.searchQuery.value.trim();

    if (!value) {
      return;
    }

    page = 1;

      const params = createUrlParams(value, page);
      const { hits, totalHits } = await getData(params);
      const markup = createMarkup(hits);
      addMarkup(markup);
  
      lightbox.refresh();
      showMessage('success', `Hooray! We found totalHits ${totalHits} images.`);
  
      if (totalHits <= PER_PAGE) {
        loadBtn.classList.add('is-hidden');
        showMessage();
      } else {
        loadBtn.classList.remove('is-hidden');
      }
    } catch (error) {
      console.log(error.message);
    }
}

function createUrlParams(value, page) {
    return new URLSearchParams({
      q: value,
      page: page,
      per_page: PER_PAGE,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      key: API_KEY,
    });
}

function addMarkup(markup = '') {
    galleryEl.insertAdjacentHTML('beforeend', markup);
}

async function onClick() {
  try {
    page += 1;
    const params = createUrlParams(value, page);
    const { hits, totalHits } = await getData(params);
    const markup = createMarkup(hits);
    addMarkup(markup);
    lightbox.refresh();
      if (page * PER_PAGE >= totalHits) {
        loadBtn.classList.add('is-hidden');
        showMessage();
      }
    gallery.lastElementChild.scrollIntoView({
      behavior: 'smooth',
      });
    } catch (error) {
      console.log(error.message);
    }
}

function showMessage(
  method = 'warning',
  message = "We're sorry, but you've reached the end of search results."
) {
  Notify[method](message);
}

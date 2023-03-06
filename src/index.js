import keyBy from 'lodash/keyBy.js';
// import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import './style.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import app from './app';

console.log('Hello, World!');

const schema = yup.object().shape({
  url: yup.string().trim().required().url().notOneOf(state.links, 'RSS уже существует'),
});
const validate = (url) => {
  try {
    schema.validateSync(url, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

export default () => {
  const initialState = {
    links: [],
  };

  const state = onChange(initialState, render(elements, initialState));
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const result = validate(url);
    if (isEmpty(result)) {
      state.links.push(url);
    }
  });
};

app();

import './style.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';

const app = () => {
  const elements = {
    form: document.querySelector('form'),
    urlInput: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedbackString: document.querySelector('.feedback'),
  };

  // Модель ничего не знает о контроллерах и о представлении. В ней не хранятся DOM-элементы.
  const initialState = {
    form: {
      valid: true,
      processState: 'filling',
      error: '',
      field: { url: '' },
    },
    links: [],
  };

  const state = onChange(initialState, render(elements, initialState));

  yup.setLocale({
    mixed: {
      required: 'emptyInput',
      notOneOf: 'dublUrl',
    },
    string: {
      url: 'invalidUrl',
    },
  });
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(initialState.links, 'this link is already added');

  // Контроллеры меняют модель, тем самым вызывая рендеринг.
  // Контроллеры не должны менять DOM напрямую, минуя представление.

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url').trim();
    state.form.field.url = value;
    schema
      .validate(state.form.field.url)
      .then(() => {
        state.links.push(value);
        state.form.error = '';
        state.form.valid = true;
      })
      .catch((error) => {
        state.form.error = error.message;
        state.form.valid = false;
      });
  });
};

app();

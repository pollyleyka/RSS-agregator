import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './render.js';

import resources from './locales/index.js';

export default () => {
  const lng = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng,
      debug: false,
      resources,
    })
    .then(() => {
      const elements = {
        form: document.querySelector('form'),
        urlInput: document.getElementById('url-input'),
        submitButton: document.querySelector('button[type="submit"]'),
        feedbackString: document.querySelector('.feedback'),
        postsContainer: document.querySelector('.posts'),
        feedsContainer: document.querySelector('.feeds'),
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
        posts: [{
          id: '',
          link: '',
          text: '',
        }],
      };

      const state = onChange(initialState, render(elements, initialState, i18nInstance));

      yup.setLocale({
        mixed: {
          required: 'emptyInput',
          notOneOf: 'dublUrl',
        },
        string: {
          url: 'invalidUrl',
        },
      });
      const validate = (string) => {
        const schema = yup.string()
          .required()
          .url()
          .notOneOf(initialState.links);
        return schema.validate(string);
      };
        // Контроллеры меняют модель, тем самым вызывая рендеринг.
        // Контроллеры не должны менять DOM напрямую, минуя представление.
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const value = formData.get('url').trim();
        state.form.field.url = value;
        validate(state.form.field.url)
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
    });
};

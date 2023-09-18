import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import axios from 'axios';
import render from './render.js';
import parser from './parser.js';

import resources from './locales/index.js';

export default () => {
  const lng = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng,
    resources,
  })
    .then(() => {
      const elements = {
        form: document.querySelector('form'),
        input: document.getElementById('url-input'),
        submit: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
        modal: document.querySelector('.modal'),
        modalTitle: document.querySelector('.modal-title'),
        modalDescription: document.querySelector('.modal-body'),
        modalFullArticle: document.querySelector('.full-article'),
      };
      const initialState = {
        status: 'filling', /* filling, loading, loaded, failed */
        error: null,
        field: '',
        links: [],
        posts: [],
        feeds: [],
        shownPostId: null,
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
          .notOneOf(state.links);
        return schema.validate(string);
      };
        // Контроллеры меняют модель, тем самым вызывая рендеринг.
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = new FormData(e.target).get('url').trim();
        state.field = value;
        validate(state.field)
          .then(() => {
            const urlWithProxy = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${state.field}`)}`;
            axios.get(urlWithProxy)
              .then((responce) => {
                const [feed, posts] = parser(responce.data.contents);
                feed.id = _.uniqueId();
                feed.link = state.field;
                state.feeds.push(feed);
                posts.forEach((post) => {
                  post.id = _.uniqueId();
                  post.feedId = feed.id;
                });
                state.posts = [...posts, ...state.posts];
                state.status = 'loaded';
                state.error = null;
                state.links.push(state.field);
              })
              .catch((err) => {
                if (err.isAxiosError) {
                  state.error = 'networkError';
                } else if (err.isParserError) {
                  state.error = 'parserError';
                } else {
                  state.error = 'unknowError';
                }
                state.status = 'failed';
              });
          })
          .catch((err) => {
            console.log(err);
            state.error = err.message;
            state.status = 'failed';
          });
      });
      elements.posts.addEventListener('click', (e) => {
        const { target } = e;
        const { dataset: { id } } = target;
        if (id) {
          state.shownPostId = id;
        }
      });
    });
};

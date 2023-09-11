import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './render.js';
import parser from './parser.js';

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
          // id: '',
          // link: '',
          // text: '',
        }, {}],
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
            fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(`${state.form.field.url}`)}`)
              .then((response) => {
                const parsedData = parser(response.data.contents);
                console.log(parsedData);
                // state.links.push(value);
                // state.form.error = '';
                // state.form.valid = true;
              })
              .catch((error) => {
                state.form.error = error.message;
                state.form.valid = false;
              });
          })
          .catch((error) => {
            state.form.error = error.message;
            state.form.valid = false;
          });
      });
    });
};
// fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent('https://wikipedia.org')}`)
//   .then(response => {
//     if (response.ok) return response.json()
//     throw new Error('Network response was not ok.')
//   })
//   .then(data => console.log(data.contents));

// const proxy = new Proxy(target, handler);

// const student = {
//   name: 'Roman',
//   age: 23,
//   program: 'js-frontend',
// };

// const rewrite = new Proxy(student, {
//   set: (target, prop, value) => {
// если свойство есть в объекте, proxy позволяет нам его переписать
//     if (prop in target) {
//       target[prop] = value;
// при успешной записи, метод set() должен вернуть true
//       return true;
//     } else {
// если свойства нет в объекте, то выбросится ошибка, либо можем вернуть false
//       throw new Error(`Cannot rewrite non-existed property '${prop}'`);
//     }
//   },
// });

// Надо пропустить свою ссылку, куда будешь делать запрос, через allOrigins

// Допустим, тебе надо сделать запрос на http://site.com
// Вместо этого делаешь через
// https://allorigins.hexlet.app/get?disableCache=true&url=http://site.com
// В параметрах видно что отключён кэш, чтобы всегда получать свежие данные
// В ответ получишь объект со статусом и полученным контентом - попробуй в консоль вывести, всё станет ясно)

// Тебе нужно юзать цепочку then-catch. Сначала делаешь запрос(не забывая юзать прокси хекслета) и принимаешь ответ
// (.then((response) => ...)) Внутри тебе нужно данные разпарсить(см.подсказку в уроке), обработать, построив структуру(вспоминаем деревья)
// и уже потом добавить в стейт через вотчера, чтобы он поймал изменения и уже "отдал приказ" функциям отрисовки.
// Отрисовка, тут все просто.
// Пишешь функцию, где создаешь DOM элементы и наполняешь их из полученных данных.
// Какие атрибуты должны быть для бутстрапа можешь посмотреть( и копирнуть себе)
// в примере-образце. А ошибки обрабатываешь уже внутри catch

// нужно делать запрос по переданной ссылке и получать данные.
// да, все верно. И как Сергей подсказывает, необходимо воспользоваться "прокси".
// Реализуем при помощи axios - примеры были в упражнениях.
// Эти данные нужно обработать и добавить в стейст, разбить по разделам стейта
// Все верно. Полученные данные необходимо распарсить (парсер размещаем в отдельном модуле),
// добавить в стейт и при изменении стейта сработает функция вотчера - используем библиотеку onChange.
// написать рендеринг верстки постов и фидов, добавить логику запускающую этот рендеринг.
// Да, отлично - порядок рендера вам подскажет как оптимально хранить данные.

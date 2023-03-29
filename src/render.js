// Представление не меняет модель.
// В представлении происходит отображение модели на страницу
// Функция возвращает функцию. Подробнее: https://ru.hexlet.io/qna/javascript/questions/chto-oznachaet-funktsiya-vida-const-render-a-b

const renderError = (elements, value, i18nInstance) => {
  const feedbackEl = elements.feedbackString;
  if (value === '') {
    feedbackEl.textContent = i18nInstance.t('success');
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
  } else {
    feedbackEl.classList.add('text-danger');
    feedbackEl.classList.remove('text-success');
    switch (value) {
      case 'invalidUrl':
        feedbackEl.textContent = i18nInstance.t('inputErrors.invalidUrl');
        break;
      case 'dublUrl':
        feedbackEl.textContent = i18nInstance.t('inputErrors.dublUrl');
        break;
      case 'emptyInput':
        feedbackEl.textContent = i18nInstance.t('inputErrors.emptyInput');
        break;
      default:
        throw new Error('Unknown error ', value);
    }
  }
};
const handleValidationState = (elements, value) => {
  if (value === true) {
    elements.urlInput.classList.remove('is-invalid');
  } else {
    elements.urlInput.classList.add('is-invalid');
  }
};

export default (elements, initialState, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form.valid':
      handleValidationState(elements, value);
      break;
    case 'form.error':
      renderError(elements, value, i18nInstance);
      break;
    case 'links':
      elements.form.reset();
      elements.urlInput.focus();
      // renderPostsFeeds(elements, state, i18nInstance);
      break;
    case 'form.field.url':
      break;
    default:
      throw new Error('Unknown state ', path);
  }
};

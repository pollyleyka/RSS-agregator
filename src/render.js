// Представление не меняет модель.
// В представлении происходит отображение модели на страницу

const renderError = (elements, value, i18nInstance) => {
  const { feedback } = elements;
  switch (value) {
    case 'invalidUrl':
      feedback.textContent = i18nInstance.t('errors.invalidUrl');
      break;
    case 'dublUrl':
      feedback.textContent = i18nInstance.t('errors.dublUrl');
      break;
    case 'emptyInput':
      feedback.textContent = i18nInstance.t('errors.emptyInput');
      break;
    default:
      throw new Error('Unknown error ', value);
  }
};

// Функция возвращает функцию. Подробнее: https://ru.hexlet.io/qna/javascript/questions/chto-oznachaet-funktsiya-vida-const-render-a-b
export default (elements, initialState, i18nInstance) => (path, value) => {
  switch (path) {
    case 'error':
      if (value === null) {
        elements.feedback.textContent = i18nInstance.t('success');
        elements.feedback.classList.replace('text-danger', 'text-success');
      } else {
        elements.feedback.classList.replace('text-success', 'text-danger');
        renderError(elements, value, i18nInstance);
      }
      break;
    case 'links':
      elements.form.reset();
      elements.input.focus();
      break;
    case 'field':
      break;
    case 'status':
      if (value === 'loading') {
        elements.submit.disabled = true;
      }
      if (value === 'loaded') {
        elements.feedback.textContent = i18nInstance.t('success');
        elements.feedback.classList.replace('text-danger', 'text-success');
        elements.submit.disabled = false;
      }
      if (value === 'failed') {
        renderError(elements, initialState.error, i18nInstance);
        elements.submit.disabled = false;
      }
      break;
    default:
      throw new Error('Unknown state ', path);
  }
};

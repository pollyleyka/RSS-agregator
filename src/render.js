// Представление не меняет модель.
// В представлении происходит отображение модели на страницу
// Функция возвращает функцию. Подробнее: https://ru.hexlet.io/qna/javascript/questions/chto-oznachaet-funktsiya-vida-const-render-a-b

const renderError = (elements, value, state) => {
  const feedbackEl = elements.feedbackString;
  if (value === '') {
    feedbackEl.textContent = '';
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
  } else {
    feedbackEl.classList.add('text-danger');
    feedbackEl.classList.remove('text-success');
    feedbackEl.textContent = state.form.error;
  }
};
const handleValidationState = (elements, value) => {
  if (value === true) {
    elements.urlInput.classList.remove('is-invalid');
    elements.form.reset();
    elements.urlInput.focus();
  } else {
    elements.urlInput.classList.add('is-invalid');
  }
};

export default (elements, initialState) => (path, value) => {
  switch (path) {
    case 'form.valid':
      handleValidationState(elements, value);
      break;
    case 'form.error':
      renderError(elements, value, initialState);
      break;
    case 'links':
      console.log(value);
      break;
    case 'form.field.url':
      break;
    default:
      throw new Error('Unknown state ', path);
  }
};

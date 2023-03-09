// Представление не меняет модель.
// В представлении происходит отображение модели на страницу
// Функция возвращает функцию. Подробнее: https://ru.hexlet.io/qna/javascript/questions/chto-oznachaet-funktsiya-vida-const-render-a-b

const renderError = (elements, value) => {
  const feedbackEl = elements.feedbackString;
  if (value === '') {
    feedbackEl.textContent = '';
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
  } else {
    feedbackEl.classList.add('text-danger');
    feedbackEl.classList.remove('text-success');
    switch (value) {
      case 'invalidUrl':
        feedbackEl.textContent = 'Ссылка должна быть валидным URL';
        break;
      case 'dublUrl':
        feedbackEl.textContent = 'RSS уже существует';
        break;
      case 'emptyInput':
        feedbackEl.textContent = 'Заполните поле';
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

export default (elements, initialState) => (path, value) => {
  console.log(value, initialState);
  switch (path) {
    case 'form.valid':
      handleValidationState(elements, value);
      break;
    case 'form.error':
      renderError(elements, value, initialState);
      break;
    case 'links':
      elements.form.reset();
      elements.urlInput.focus();
      break;
    case 'form.field.url':
      break;
    default:
      throw new Error('Unknown state ', path);
  }
};

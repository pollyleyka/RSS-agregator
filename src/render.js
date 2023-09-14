// Представление не меняет модель.
// В представлении происходит отображение модели на страницу
// Функция возвращает функцию. Подробнее: https://ru.hexlet.io/qna/javascript/questions/chto-oznachaet-funktsiya-vida-const-render-a-b
export default (elements, initialState, i18nInstance) => (path, value) => {
  switch (path) {
    case 'error':
      if (value === null) {
        elements.feedback.textContent = i18nInstance.t('success');
        elements.feedback.classList.replace('text-danger', 'text-success');
        elements.input.classList.remove('is-invalid');
      } else {
        elements.feedback.classList.replace('text-success', 'text-danger');
        elements.input.classList.add('is-invalid');
        elements.feedback.textContent = i18nInstance.t(`errors.${value}`);
      }
      break;
    case 'status': /* filling, loading, loaded, failed */
      if (value === 'loading') {
        elements.submit.disabled = true;
      }
      if (value === 'loaded') {
        elements.form.reset();
        elements.input.focus();
        elements.feedback.textContent = i18nInstance.t('success');
        elements.feedback.classList.replace('text-danger', 'text-success');
        elements.submit.disabled = false;
      }
      if (value === 'failed') {
        elements.feedback.textContent = i18nInstance.t(`errors.${initialState.error}`);
        elements.submit.disabled = false;
      }
      break;
    case 'links':
      break;
    case 'field':
      break;
    default:
      throw new Error('Unknown state ', path);
  }
};

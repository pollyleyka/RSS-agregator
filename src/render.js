// Представление не меняет модель.
// В представлении происходит отображение модели на страницу
const containerRender = (containerName, container, i18nInstance) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  card.innerHTML = '';

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardHeader = document.createElement('h2');
  cardHeader.classList.add('card-title', 'h4');
  cardHeader.textContent = i18nInstance.t(`${containerName}`);
  cardBody.append(cardHeader);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  card.append(cardBody, list);

  container.innerHTML = '';
  container.append(card);
};
const renderFeeds = (feeds, i18nInstance, elements) => {
  containerRender('feeds', elements.feeds, i18nInstance);

  const feedsList = elements.feeds.querySelector('.card ul');

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedHeader = document.createElement('h3');
    feedHeader.classList.add('h6', 'm-0');
    feedHeader.textContent = feed.title;
    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = feed.description;

    li.append(feedHeader, feedDescription);
    feedsList.prepend(li);
  });
};
const setAttributes = (element, attributes) => {
  attributes.forEach((attr) => {
    const [name, value] = attr;
    element.setAttribute(name, value);
  });
};

const renderPosts = (posts, i18nInstance, elements) => {
  containerRender('posts', elements.posts, i18nInstance);

  const postsList = elements.posts.querySelector('.card ul');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    const linkAttributes = [['href', post.link], ['data-id', post.id], ['target', '_blank'], ['rel', 'noopener norefferer']];
    setAttributes(a, linkAttributes);
    a.textContent = post.title;

    const button = document.createElement('button');
    const buttonAttributes = [['type', 'button'], ['data-id', post.id], ['data-bs-toggle', 'modal'], ['data-bs-target', '#modal']];
    setAttributes(button, buttonAttributes);
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18nInstance.t('openBtn');

    li.append(a, button);
    postsList.append(li);
  });
};

// Функция возвращает функцию. Подробнее: https://ru.hexlet.io/qna/javascript/questions/chto-oznachaet-funktsiya-vida-const-render-a-b
export default (elements, initialState, i18nInstance) => (path, value) => {
  switch (path) {
    case 'error':
      if (value === null) {
        elements.feedback.textContent = i18nInstance.t('success'); /* кажется нужно убрать */
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
    case 'feeds':
      renderFeeds(initialState.feeds, i18nInstance, elements);
      break;
    case 'posts':
      renderPosts(initialState.posts, i18nInstance, elements);
      break;
    default:
      throw new Error('Unknown state ', path);
  }
};

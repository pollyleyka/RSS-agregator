import onChange from 'on-change';

const setAttributes = (element, attributes) => {
  attributes.forEach((attr) => {
    const [name, value] = attr;
    element.setAttribute(name, value);
  });
};
const renderModalWindow = (id, posts, elements) => {
  const a = document.querySelector(`[data-id="${id}"]`);
  a.classList.replace('fw-bold', 'fw-normal');
  a.classList.add('link-secondary');

  const selectedPost = posts.find((post) => post.id === id);

  elements.modalTitle.textContent = selectedPost.title;
  elements.modalDescription.textContent = selectedPost.description;
  elements.modalFullArticle.setAttribute('href', selectedPost.link);
};

const renderContainer = (containerName, i18n) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  card.innerHTML = '';

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardHeader = document.createElement('h2');
  cardHeader.classList.add('card-title', 'h4');
  cardHeader.textContent = i18n.t(`${containerName}`);
  cardBody.append(cardHeader);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  card.append(cardBody, list);

  return [card, list];
};

const renderFeeds = (feeds, i18n, elements) => {
  const [card, list] = renderContainer('feeds', i18n);

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
    list.prepend(li);
  });
  elements.feeds.innerHTML = '';
  elements.feeds.append(card);
};

const renderPosts = (posts, shownPostsIds, i18n, elements) => {
  const [card, list] = renderContainer('posts', i18n);

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    if (shownPostsIds.has(post.id)) {
      a.classList.replace('fw-bold', 'fw-normal');
      a.classList.add('link-secondary');
    }
    const linkAttributes = [['href', post.link], ['data-id', post.id], ['target', '_blank'], ['rel', 'noopener norefferer']];
    setAttributes(a, linkAttributes);
    a.textContent = post.title;

    const button = document.createElement('button');
    const buttonAttributes = [['type', 'button'], ['data-id', post.id], ['data-bs-toggle', 'modal'], ['data-bs-target', '#modal']];
    setAttributes(button, buttonAttributes);
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18n.t('openBtn');

    li.append(a, button);
    list.append(li);
  });
  elements.posts.innerHTML = '';
  elements.posts.append(card);
};
const renderFeedback = (value, elements, i18n) => {
  if (value === null) {
    elements.feedback.textContent = '';
    elements.input.classList.remove('is-invalid');
  } else if (value === 'success') {
    elements.feedback.textContent = i18n.t('success');
    elements.feedback.classList.replace('text-danger', 'text-success');
    elements.input.classList.remove('is-invalid');
  } else {
    elements.feedback.textContent = i18n.t(`errors.${value}`);
    elements.feedback.classList.replace('text-success', 'text-danger');
    elements.input.classList.add('is-invalid');
  }
};
const renderStatus = (value, elements, i18n, state) => {
  if (value === 'loading') {
    elements.submit.disabled = true;
    renderFeedback(null, elements, i18n);
  }
  if (value === 'loaded') {
    elements.form.reset();
    elements.input.focus();
    elements.submit.disabled = false;
    renderFeedback('success', elements, i18n);
  }
  if (value === 'failed') {
    renderFeedback(state.error, elements, i18n);
    elements.submit.disabled = false;
  }
};

export default (initialState, i18n, elements) => {
  const state = onChange(initialState, (path, value) => {
    switch (path) {
      case 'error':
        renderFeedback(value, elements, i18n);
        break;
      case 'status':
        renderStatus(value, elements, i18n, state);
        break;
      case 'feeds':
        renderFeeds(state.feeds, i18n, elements);
        break;
      case 'posts':
        renderPosts(state.posts, state.shownPostsIds, i18n, elements);
        break;
      case 'shownPostId':
        renderModalWindow(state.shownPostId, state.posts, elements);
        break;
      case 'shownPostsIds':
        break;
      default:
        throw new Error('Unknown state ', path);
    }
  });
  return state;
};

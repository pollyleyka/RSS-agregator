const makePostElement = (postData, i18nInstance) => {
  const link = document.createElement('li');
  link.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-baseline',
    'border-end-g',
  );
  const linkEl = document.createElement('a');
  linkEl.classList.add('fw-bold');
  linkEl.href = postData.link;
  linkEl.setAttribute('target', '_blanc');
  linkEl.setAttribute('rel', 'noopener noreferrer');
  linkEl.dataset.id = postData.id;
  linkEl.textContent = postData.text;

  const btn = document.createElement('button');
  btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  btn.type = 'button';
  btn.dataset.bsToggle = 'modal';
  btn.dataset.bsTarget = '#modal';
  btn.dataset.id = postData.id;
  btn.textContent = i18nInstance.t('posts.openBtn');
  link.append(linkEl, btn);

  return link;
};

export default (elements, state, i18nInstance) => {
  const { postsContainer } = elements;

  postsContainer.innerHTML = '';

  if (state.posts.length === 0) {
    return;
  }

  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  postsContainer.append(div);

  const postsHeaderContainer = document.createElement('div');
  postsHeaderContainer.classList.add('card-body');
  div.append(postsHeaderContainer);

  const postsHeader = document.createElement('h2');
  postsHeader.classList.add('card-title', 'h4');
  postsHeader.textContent = i18nInstance.t('posts.postsHeader');
  postsHeaderContainer.append(postsHeader);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'list-group-flush');
  div.append(postsList);

  const links = state.posts
    .map((postData) => makePostElement(postData, i18nInstance));
  postsList.append(...links);
};

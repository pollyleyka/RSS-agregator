export default (data) => {
  const parser = new DOMParser();
  const newData = parser.parseFromString(data, 'application/xml');
  console.log('first', newData);
  const feedTitle = newData.querySelector('channel title').textContent;
  const feedDescription = newData.querySelector('channel description').textContent;
  const feed = {
    title: feedTitle,
    description: feedDescription,
  };
  const items = newData.querySelectorAll('item');
  const posts = Array.from(items);
  posts.map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));
  console.log('second', feed, posts);
  return [feed, posts];
};

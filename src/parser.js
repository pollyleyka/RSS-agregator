export default (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, 'text/xml');
  // console.log(dom.header, dom.feed, dom.items);
  // return [dom.feed, dom.items];
  // И вот уже из этого объекта можно достать необходимые данные и вернуть их из парсинга:
  // заголовок, описание RSS-канала (feed), а также список постов (items) с их заголовками и описаниями.
};

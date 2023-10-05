import * as yup from 'yup';

export default yup.setLocale({
  mixed: {
    required: 'emptyInput',
    notOneOf: 'dublUrl',
  },
  string: {
    url: 'invalidUrl',
  },
});

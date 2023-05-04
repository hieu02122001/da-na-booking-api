const slugify = require('slugify');

const PORT = 4000;
const PATH = '/api';
const HASH_TIMES = 8;

const slug = function (str, more) {
  return slugify(str, {
    replacement: '-',
    lower: true,
    locale: 'vi',
    trim: true
  })
}

module.exports = {
  PORT,
  PATH,
  HASH_TIMES,
  //
  slug,
}
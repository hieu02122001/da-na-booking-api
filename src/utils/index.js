const slugify = require("slugify");
const moment = require("moment");

const PORT = 4000;
const PATH = "/api";
const HASH_TIMES = 8;

const slug = function (str, more) {
  return slugify(str, {
    replacement: "-",
    lower: true,
    locale: "vi",
    trim: true,
  });
};

const formatDate = function (date) {
  return moment(date).format("DD/MM/YYYY HH:mm");
};

module.exports = {
  PORT,
  PATH,
  HASH_TIMES,
  //
  slug,
  formatDate,
};

const lodash = require("lodash");
const { District } = require("../models/_District");

this.findDistricts = async function (criteria, more) {
  const districts = await District.find().sort([["name", 1]]);
  //
  for (let i = 0; i < districts.length; i++) {
    districts[i] = await this.wrapExtraToDistrict(districts[i].toJSON(), more);
  }
  //
  return {
    count: districts.length,
    rows: districts,
  };
};

this.wrapExtraToDistrict = async function (districtObj, more) {
  // id
  districtObj.id = lodash.get(districtObj, "_id").toString();
  //
  return lodash.omit(districtObj, ["_id"]);
};

module.exports = this;

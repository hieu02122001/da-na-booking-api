const lodash = require('lodash');
const { Package } = require('../models/_Package');
const { mongoose } = require('mongoose');
const { slug } = require('../utils');
const moment = require('moment');

this.findPackages = async function(criteria, more) {
  // Build query
  //
  const packages = await Package.find()
  .sort([['price', 1]]);
  //
  for (let i = 0; i < packages.length; i++) {
    packages[i] = await this.wrapExtraToPackage(packages[i].toJSON(), more);
  }
  // pagination
  const DEFAULT_LIMIT = 6;
  const page = lodash.get(criteria, "page") || 1;
  const _start = DEFAULT_LIMIT * (page -1);
  const _end = DEFAULT_LIMIT * page;
  const paginatedPackages = lodash.slice(packages, _start, _end);
  //
  const output = {
    count: packages.length,
    page: page,
    rows: paginatedPackages,
  }
  return output;
}

this.getPackage = async function (packageId, more) {
  const packages = await Package.findById(packageId);
  //
  if (!packages) {
    throw new Error(`Not found packages with id [${packageId}]!`);
  }
  //
  return this.wrapExtraToPackage(packages.toJSON(), more);
};

this.wrapExtraToPackage = async function(packageObj, more) {
  // id
  packageObj.id = lodash.get(packageObj, "_id").toString();
  //
  return lodash.omit(packageObj, ["_id"]);
};

this.createPackage = async function (packageObj, more) {
  const package = new Package(packageObj);
  await package.save();
  //
  return package;
}

this.updatePackage = async function (packageId, packageObj, more) {
  const package = await Package.findByIdAndUpdate(packageId, packageObj, { new: true, runValidators: true });
  //
  if (!package) {
    throw new Error(`Not found package with id [${packageId}]!`);
  }
  //
  await package.save();
  //
  return package;
}

this.removePackage = async function(packageId, more) {
  const package = await Package.findByIdAndRemove(packageId);
  //
  if (!package) {
    throw new Error(`Not found package with id [${packageId}]!`);
  }
  //
  return package;
};
//
module.exports = this
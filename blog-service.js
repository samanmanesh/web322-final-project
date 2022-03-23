const Sequelize = require('sequelize');

var sequelize = new Sequelize('depgminhbdsjlp', 'rwomqnyqcmllbj', 'f9f503f6ddb6107f474776f6074fe19cce26eb7d3490182857feeaa42168f768', {
  host: 'ec2-3-229-161-70.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
  ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
  });

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getAllPosts = () => {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.addPost = (postData) => {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getPostsByCategory = (
  category
) => {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getPostsByMinDate = (
  minDateStr
) => {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getPostById = (id) => {
  
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getPublishedPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    reject();
  });
};



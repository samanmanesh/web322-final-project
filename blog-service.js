const fs = require("fs");
const { resolve } = require("path");

let posts = [];
let categories = [];

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      "./data/posts.json",
      "utf8",
      (err, data) => {
        if (err) {
          reject("unable to read file");
          // return;
        } else {
          posts = JSON.parse(data);
          fs.readFile(
            "./data/categories.json",
            "utf8",
            (err, data) => {
              if (err) {
                reject("unable to read file");
                // return;
              } else {
                categories = JSON.parse(data);
                resolve();
              }
            }
          );
        }
      }
    );
  });
};

module.exports.getAllPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("no result returned");
    } else resolve(posts);
  });
};

module.exports.getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("no result returned");
    } else {
      let publishedPosts = posts.filter(
        (post) => post.published === true
      );
      resolve(publishedPosts);
    }
  });
};

module.exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("no result returned");
    } else resolve(categories);
  });
};

module.exports.addPost = (postData) => {
  return new Promise((resolve, reject) => {
    if (postData.published === undefined) {
      postData.published = false;
    } else {
      postData.published = true;
    }
    postData.id = posts.length + 1;
    postData.postDate = new Date().toISOString().substring(0, 10);
    posts.push(postData);

    resolve(postData);

    //update file post.json after adding post to posts array
    // fs.writeFile(
    //   "./data/posts.json",
    //   JSON.stringify(posts),
    //   (err) => {
    //     if (err) {
    //       reject("unable to write file");
    //     } else {
    //       resolve(postData);
    //     }
    //   }
    // );
  });
};

module.exports.getPostsByCategory = (
  category
) => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("no result returned");
    } else {
      let filteredPosts = posts.filter(
        (post) => post.category == category
      );
      resolve(filteredPosts);
    }
  });
};

module.exports.getPostsByMinDate = (
  minDateStr
) => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("no result returned");
    } else {
      let filteredPosts = posts.filter((post) => {
        return (
          new Date(post.postDate) >=
          new Date(minDateStr)
        );
      });
      resolve(filteredPosts);
    }
  });
};

module.exports.getPostById = (id) => {
  
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("no result returned");
    } else {
      let filteredPosts = posts.filter(
        (post) => post.id == id
      );

      resolve(filteredPosts[0]);
    }
  });
};

module.exports.getPublishedPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("no result returned");
    } else {
      let filteredPosts = posts.filter(
        (post) => post.category == category && post.published === true
      );
      resolve(filteredPosts);
    }
  });
};



const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "depgminhbdsjlp",
  "rwomqnyqcmllbj",
  "f9f503f6ddb6107f474776f6074fe19cce26eb7d3490182857feeaa42168f768",
  {
    host: "ec2-3-229-161-70.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

const Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

const Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

Post.belongsTo(Category, {
  foreignKey: "category",
});

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to sync the database");
      });
  });
};

module.exports.getAllPosts = () => {
  return new Promise((resolve, reject) => {
    Post.findAll()
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
      },
    })
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((categories) => {
        resolve(categories);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.addPost = (postData) => {
  return new Promise((resolve, reject) => {
    postData.published = postData.published
      ? true
      : false;

    for (let key in postData) {
      if (postData[key] === "") {
        postData[key] = null;
      }
    }

    postData.postDate = new Date();

    Post.create(postData)
      .then((post) => {
        resolve(post);
      })
      .catch((err) => {
        reject("unable to create post");
      });
  });
};

module.exports.getPostsByCategory = (
  category
) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        category: category,
      },
    })
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPostsByMinDate = (
  minDateStr
) => {
  return new Promise((resolve, reject) => {
    //using Sequelize operators to compare dates
    // const Op = Sequelize.Op;
    // PostDate : {
    //   [Op.gte]: new Date(minDateStr)
    // }
    // OR following method =>
    const { gte } = Sequelize.Op;
    Post.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDateStr),
        },
      },
    })
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        id: id,
      },
    })
      .then((posts) => {
        //returns an array with one post objects
        resolve(posts[0]);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPublishedPostsByCategory = (
  category
) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        category: category,
        published: true,
      },
    })
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.addCategory = (categoryData) => {
  return new Promise((resolve, reject) => {
    for (let key in categoryData) {
      if (categoryData[key] === "") {
        categoryData[key] = null;
      }
    }
    Category.create(categoryData)
      .then((category) => {
        resolve(category);
      })
      .catch((err) => {
        reject("unable to create category");
      });
  });
};

module.exports.deleteCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: {
        id: id,
      },
    })
      .then((category) => {
        resolve("destroyed");
      })
      .catch((err) => {
        reject("Reject");
      });
  });
};

module.exports.deletePostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: {
        id: id,
      },
    })
      .then((post) => {
        resolve("destroyed");
      })
      .catch((err) => {
        reject("Reject");
      });
  });
};

module.exports.deletePostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: {
        id: id,
      },
    })
      .then((post) => {
        resolve("destroyed");
      })
      .catch((err) => {
        reject("was rejected");
      });
  });
};

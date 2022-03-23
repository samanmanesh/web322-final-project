/*********************************************************************************
 * WEB322 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: __Mohammadhossein Sobhanmanesh__ Student ID: __116523200__ Date: __2022-03-22__
 *
 * Online (Heroku) Link: 
 *
 ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const blogService = require("./blog-service");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const exphbs = require("express-handlebars");

const stripJs = require("strip-js");

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute
            ? ' class="active" '
            : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error(
            "Handlebars Helper equal needs 2 parameters"
          );
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
      safeHTML: function (context) {
        return stripJs(context);
      },
    },
  })
);
app.set("view engine", ".hbs");

cloudinary.config({
  cloud_name: "dpjsrqj9h",
  api_key: "496951698246575",
  api_secret: "JTAkDQoLi5iUckg3xvbHhfBZH98",
  secure: true,
});

const upload = multer(); // no {storage:storage} since we are not using diskStorage

//Middleware
app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

//Routes
app.get("/", (req, res) => {
  res.redirect("/blog");
});

app.get("/about", (req, res) => {
  res.render("about", {
    //  use the default Layout (main.hbs)
  });
});

app.get("/blog/:id", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let posts = [];

    // if there's a "category" query, filter the returned posts by category

    if (req.query.category) {
      // Obtain the published "posts" by category
      posts =
        await blogService.getPublishedPostsByCategory(
          req.query.category
        );
    } else {
      // Obtain the published "posts"
      posts =
        await blogService.getPublishedPosts();
    }

    // sort the published posts by postDate
    posts.sort(
      (a, b) =>
        new Date(b.postDate) -
        new Date(a.postDate)
    );

    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the post by "id"
    viewData.post = await blogService.getPostById(
      req.params.id
    );
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories =
      await blogService.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});

app.get("/blog", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let posts = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts =
        await blogService.getPublishedPostsByCategory(
          req.query.category
        );
    } else {
      // Obtain the published "posts"
      posts =
        await blogService.getPublishedPosts();
    }

    // sort the published posts by postDate
    posts.sort(
      (a, b) =>
        new Date(b.postDate) -
        new Date(a.postDate)
    );

    // get the latest post from the front of the list (element 0)
    let post = posts[0];

    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
    viewData.post = post;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories =
      await blogService.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});

app.get("/post/:value", (req, res) => {
  blogService
    .getPostById(req.params.value)
    .then((post) => {
      res.status(200).send(post);
    })
    .catch((err) => {
      res.sendStatus(500).send({ message: err });
    });
});

app.get("/posts", (req, res) => {
  const { minDate, category } = req.query;
  if (minDate) {
    blogService
      .getPostsByMinDate(minDate)
      .then((posts) => {
        // res.status(200).send(posts);
        res.render("posts", { posts: posts });
      })
      .catch((err) => {
        res
          .sendStatus(500)
          // .send({ message: err });
          .render("posts", {
            message: "no results",
          });
      });
  } else if (category) {
    blogService
      .getPostsByCategory(category)
      .then((posts) => {
        // res.status(200).send(posts);
        res
          .status(200)
          .render("posts", { posts: posts });
      })
      .catch((err) => {
        res
          .sendStatus(500)
          // .send({ message: err });
          .render("posts", {
            message: "no results",
          });
      });
  } else {
    blogService
      .getAllPosts()
      .then((posts) => {
        // res.status(200).send(posts);
        res
          .status(200)
          .render("posts", { posts: posts });
      })
      .catch((err) => {
        res
          .sendStatus(500)
          // .send({ message: err });
          .render("posts", {
            message: "no results",
          });
      });
  }
});

app.get("/categories", (req, res) => {
  blogService
    .getCategories()
    .then((categories) => {
      // res.status(200).send(categories);
      res.status(200).render("categories", {
        categories: categories,
      });
    })
    .catch((err) => {
      // res.sendStatus(500).send({ message: err });
      res.sendStatus(500).render("categories", {
        message: "no results",
      });
    });
});

app.get("/posts/add", (req, res) => {
  // res.sendFile(
  //   path.join(__dirname, "/views/addPost.html")
  // );
  res.render("addPost", {
    //  use the default Layout (main.hbs)
  });
});

app.post(
  "/posts/add",
  upload.single("featureImage"),
  (req, res) => {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream =
            cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        });
      };
      async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
      }
      upload(req).then((uploaded) => {
        processPost(uploaded.url);
      });
    } else {
      processPost("");
    }
    function processPost(imageUrl) {
      req.body.featureImage = imageUrl;
      blogService
        .addPost(req.body)
        .then((post) => {
          res.redirect("/posts");
        });
    }
  }
);

app.use((req, res) => {
  // res.status(404).send("404: Page not found");
  res.status(404).render("404", {
    message: "404: Page not found",
  });
});

blogService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(
        `Express http server listening on ${HTTP_PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });

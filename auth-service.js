// require mongoose and setup the Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// connect to Your MongoDB Atlas Database
//mongoose.connect("mongodb+srv://SamanManesh:mongoPassword1@cluster0.goouk.mongodb.net/web322-assignment6?retryWrites=true&w=majority");

let userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

let User;

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://SamanManesh:mongoPassword1@cluster0.goouk.mongodb.net/web322-assignment6?retryWrites=true&w=majority"
    );

    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });

    db.once("open", () => {
      User = db.model("users", userSchema); // define the User model
      resolve();
    });
  });
};

module.exports.registerUser = (userData) => {
  //userData is an object with the following properties:
  //.userName, .userAgent, .email, .password, .password2
  return new Promise((resolve, reject) => {
    if (
      !userData.username ||
      !userData.password ||
      !userData.email
    ) {
      reject(
        "missing username, password, or email"
      );
    }
    if (
      userData.password !== userData.password2
    ) {
      reject("Passwords do not match");
    }
    let newUser = new User(userData);
    newUser.save((err, users) => {
      if (err && err.code === 11000) {
        // dubplicate key error
        reject("User Name already taken");
      }
      if (err) {
        reject(
          `There was an error creating the users: ${err}`
        );
      }
      resolve(users);
    });
  });
};

module.exports.checkUser = (userData) => {
  console.log("check", userData);

  return new Promise((resolve, reject) => {
    if (
      !userData.userName ||
      !userData.password
    ) {
      reject("missing username or password");
    }

    User.find({ userName: userData.userName })
      .exec()
      .then((users) => {
        if (!users) {
          reject(
            `Unable to find user: ${userData.userName}`
          );
        }

        if (users.length === 0) {
          console.log("no users", users);
          reject(
            `Unable to find user: ${userData.userName}`
          );
        }

        if (
          users[0].password !== userData.password
        ) {
          reject(
            "Incorrect Password for user: " +
              userData.userName
          );
        }

        if (
          users[0].userName ===
            userData.userName &&
          users[0].password === userData.password
        ) {
          users[0].loginHistory.push({
            dateTime: new Date().toString(),
            userAgent: userData.userAgent,
          });

          User.update(
            { userName: users[0].userName },
            {
              $set: {
                loginHistory:
                  users[0].loginHistory,
              },
            }
              .exec()
              .then((result) => {
                resolve(users[0]);
              })
              .catch((err) => {
                `There was an error verifying the user: ${err}`;
              })
          );
        }
      })
      .catch((err) => {
        console.log("hit here");
        reject(
          "Unable to find user: " +
            userData.userName
        );
      });
  });
};


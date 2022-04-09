// require mongoose and setup the Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

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
  console.log("register", userData);

  return new Promise((resolve, reject) => {
    if (
      !userData.userName ||
      !userData.password ||
      !userData.password2 ||
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
    bcrypt
      .hash(userData.password, 10)
      .then((hash) => {
        // Hash the password using a Salt that was generated using 10 rounds
        // TODO: Store the resulting "hash" value in the DB
        console.log("hash", hash);
        userData.password = hash;

        let newUser = new User(userData);
        console.log("newUser", newUser);

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
      })
      .catch((err) => {
        reject(
          "There was an error encrypting the password"
        );
        // Show any errors that occurred during the process
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

    User.find(
      { userName: userData.userName },
      (err, users) => {
        if (err) {
          reject(
            `Unable to find user: ${userData.userName}`
          );
        }
        if (users.length === 0) {
          reject(
            `Unable to find user: ${userData.userName}`
          );
        }

        if (users.length > 0) {
          bcrypt
            .compare(
              userData.password,
              users[0].password
            )
            .then((result) => {
              // result === true if it matches and result === false if it does not match
              if (result) {
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
                  },
                  (err, data) => {
                    if (err) {
                      reject(
                        `Unable to update user: ${userData.userName}`
                      );
                    }
                  }
                );
                resolve(users[0]);
              } else {
                reject(
                  "Incorrect Password for user: " +
                    userData.userName
                );
              }
            });
        }
      }
    );
  });
};

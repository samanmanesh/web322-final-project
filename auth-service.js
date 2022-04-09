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
  console.log("check" ,userData);
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
          console.log("check 2");
          reject(`Unable to find user: ${userData.userName}`);
          
        }
          console.log("users", users);
        if (users.length === 0) {
          
          console.log("check 3");
          reject(`Unable to find user: ${userData.userName}`);
          
          console.log("check 12");
        }

        if (
          users[0].password !== userData.password
        ) {
          console.log("check 4");
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
          console.log("check 13");

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
            (err, users) => {
              if (err) {
                console.log("check 5");
                reject(
                  `There was an error verifying the user: ${err}`
                );
              }
              resolve(users[0]);
            }
          );
          console.log("check 6");
        }
      }
    );
    console.log("check 7");
  });

};

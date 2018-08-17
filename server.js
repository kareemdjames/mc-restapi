const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo")(session);
const api = require("./api/controller");
const app = express();
const db = mongoose
  .connect("mongodb://localhost:27017/test")
  .then(conn => conn)
  .catch(console.error);

// Parse the request as JSON
app.use(bodyParser.json());
// Middleware that will ensure your web app is connected to MongoDB first before allowing route handlers to be executed
app.use((req, res, next) => {
  Promise.resolve(db).then(
    (connection, err) =>
      typeof connection !== "undefined" ? next() : next(new Error("MongoError"))
  );
});
// Middleware to store sessions in the Mongo db instead of storing in memory
app.use(
  session({
    secret: "Mern Cookbook Secrets",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      collection: "sessions",
      mongooseConnection: mongoose.connection
    })
  })
);

app.use("/users", api);

app.listen(1337, () => console.log("Server listening on port 1337"));

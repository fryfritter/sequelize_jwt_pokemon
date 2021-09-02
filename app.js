require("dotenv").config();
const express = require("express");
const db = require("./db/models/index");
const cookieParser = require("cookie-parser");

const pokemonRouter = require("./router/pokemons.router.js");
const trainerRouter = require("./router/trainer.router.js");

const path = require("path");
const apiRouter = express.Router();

db.sequelize.sync();

// sync will make sure the that the database is connected and the models are properly setup on app startup
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRouter);
apiRouter.use("/pokemon", pokemonRouter);
apiRouter.use("/trainer", trainerRouter);
// app.use("/pokemon", pokemonRouter);
// app.use("/trainer", trainerRouter);

app.use(express.static(path.resolve("client", "build")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve("client", "build", "index.html"))
);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;

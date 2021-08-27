require("dotenv").config();
const express = require("express");
const db = require("./db/models/index");
const cookieParser = require("cookie-parser");

const pokemonRouter = require("./router/pokemons.router.js");
const trainerRouter = require("./router/trainer.router.js");

db.sequelize.sync();

// sync will make sure the that the database is connected and the models are properly setup on app startup
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/pokemon", pokemonRouter);

app.use("/trainer", trainerRouter);
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;

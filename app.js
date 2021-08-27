const express = require("express");
const app = express();
const db = require("./db/models/index");

const pokemonRouter = require("./router/pokemons.router.js");
app.use(express.json());

// sync will make sure the that the database is connected and the models are properly setup on app startup
db.sequelize.sync();

app.use(express.json());
app.use("/pokemon", pokemonRouter);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;

// pokemons.route.js
const db = require("../db/models/index");
const express = require("express");

const router = express.Router();

// route to GET /pokemons
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const pokemons = await db.Pokemon.findByPk(id);

    res.status(200).json(pokemons);
  } catch (error) {
    next(error);
  }
});

// route to GET /pokemons
router.get("/", async (req, res, next) => {
  try {
    const pokemons = await db.Pokemon.findAll();
    res.status(200).json(pokemons);
  } catch (error) {
    next(error);
  }
});
// route to GET /pokemons
router.post("/", async (req, res, next) => {
  try {
    const created = await db.Pokemon.create(req.body);
    res.status(201).json(created.toJSON());
  } catch (error) {
    next(error);
  }
});
module.exports = router;

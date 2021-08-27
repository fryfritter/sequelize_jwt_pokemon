// pokemons.route.js
const db = require("../db/models/index");
const express = require("express");

const router = express.Router();

// route to GET /pokemons
router.get("/byId/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const pokemon = await db.Pokemon.findByPk(id);
    if (pokemon === null) res.sendStatus(404);
    else res.status(200).json(pokemon);
  } catch (error) {
    next(error);
  }
});

router.get("/searchByCriteria", async (req, res, next) => {
  try {
    const [id, type, name] = req.query;

    console.log(id, type, name);
    const pokemons = await db.Pokemon.findAll();
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

router.post("/update/:id", async (req, res, next) => {
  try {
    const idToUpdate = req.params.id;
    const reqBody = req.body;

    const [numOfUpdatedRecord, updatedRecord] = await db.Pokemon.update(
      reqBody,
      {
        where: {
          id: idToUpdate,
        },
        returning: true,
      }
    );

    res.json({
      message: `Updated ${numOfUpdatedRecord} record(s) successfully!`,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const pokemonId = req.params.id;
    const pokemonToUpdate = await db.Pokemon.findByPk(pokemonId);

    if (pokemonToUpdate === null) return res.sendStatus(404);
    await pokemonToUpdate.update(req.body);

    res.json(pokemonToUpdate);
  } catch (error) {
    next(error);
  }
});

// route to DELETE /pokemons
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedPokemonCount = await db.Pokemon.destroy({
      where: { id: req.params.id },
    });
    res.status(201).json(deletedPokemonCount, " deleted");
  } catch (error) {
    next(error);
  }
});
module.exports = router;

const express = require("express");
const db = require("../db/models/index");
const { auth } = require("../middleware/auth");
const router = express.Router();

// Add POST /trainers route
router.post("/", async (req, res, next) => {
  try {
    const newTrainer = await db.Trainer.create(req.body);
    res.send(newTrainer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    // const trainers = await db.Trainer.findAll();

    const trainers = await db.Trainer.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: {
        model: pokemon,
      },
    });

    console.log(trainers);
    res.status(200).json(trainers);
  } catch (error) {
    next(error);
  }
});

router.get("/search/:username", auth, async (req, res, next) => {
  try {
    const username = req.params.username;
    // [db.Sequelize.Op.iLike] allows you to do case-insensitive + partial querying
    // e.g. "Sa" will return Samantha, Samuel..
    const trainer = await db.Trainer.findAll({
      where: { username: { [db.Sequelize.Op.iLike]: "%" + username + "%" } },
    });
    res.send(trainer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// route to GET /pokemons
router.get("/pokemons", auth, async (req, res, next) => {
  try {
    const trainer = await db.Trainer.findOne({
      where: {
        username: req.user.username,
      },
      raw: true,
    });
    const trainerProfile = await db.Trainer.findOne({
      where: { id: trainer.id },
      include: { model: db.Pokemon },
    });

    //  const pokemons = await db.Trainer.findOne({
    //   include: {
    //     model: db.Pokemon,
    //     trainerId: trainer.id,
    //   },
    // }).Pokemons;

    console.log(trainerProfile.Pokemons);

    res.status(200).json(trainerProfile.Pokemons);
  } catch (error) {
    next(error);
  }
});

const bcrypt = require("bcryptjs");
const createJWTToken = require("../config/jwt");
const pokemon = require("../db/models/pokemon");

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const trainer = await db.Trainer.findOne({
      where: { username },
      attributes: { include: ["password"] },
    });

    // return if Trainer does not exist
    // message returned is intentionally vague for security reasons
    if (!trainer) {
      return res.status(422).json({ message: "Invalid username or password." });
    }

    // check if user input password matches hashed password in the db
    const result = await bcrypt.compare(password, trainer.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(trainer.username);

    // calculation to determine expiry date - this is up to your team to decide
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    // you are setting the cookie here, and the name of your cookie is `token`
    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true, // client-side js cannot access cookie info
      secure: true, // use HTTPS
    });

    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  // clears the 'token' cookie from your browser
  res.clearCookie("token").send("You are now logged out!");
});

module.exports = router;

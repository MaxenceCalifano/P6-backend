const Sauce = require("../models/sauces");
const fs = require("fs"); //Filesysteme

exports.addSauce = (req, res, next) => {
  console.log(req.body.sauce);
  const sauceObject = JSON.parse(req.body.sauce);

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ messageTest: "sauce enregistrée" }))
    .catch(() => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //findOne cherche la sauce qui aura le même id que le paramètre de la requete
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      res.status(404).json({
        error: new Error("No such Sauce!"),
      });
    }
    if (sauce.userId !== req.auth.userId) {
      res.status(400).json({
        error: new Error("Unauthorized request!"),
      });
    }
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => {
        res.status(200).json({
          message: "Deleted!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

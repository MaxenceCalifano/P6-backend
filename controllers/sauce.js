const Sauce = require("../models/sauces");
const fs = require("fs"); //Filesysteme

exports.addSauce = (req, res, next) => {
  console.log(req, req.body.sauce);
  const sauceObject = JSON.parse(req.body.sauce);

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
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

exports.modifySauce = (req, res, next) => {
  console.log(req);
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ messag: "l'objet a été modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeDislike = (req, res, next) => {
  let usersLiked = [];
  let usersDisliked = [];
  let userId = req.body.userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      usersLiked = sauce.usersLiked;
      usersDisliked = sauce.usersDisliked;
    })
    .then(() => {
      if (req.body.like === 1) {
        usersLiked.push(userId);
        Sauce.updateOne(
          { _id: req.params.id },
          { $set: { usersLiked: usersLiked, likes: usersLiked.length } }
        )
          .then(() => res.status(200).json({ message: "la sauce a été likée" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (req.body.like === 0) {
        if (usersLiked.includes(userId)) {
          usersLiked.splice(usersLiked.indexOf(userId), 1);
          Sauce.updateOne(
            { _id: req.params.id },
            { $set: { usersLiked: usersLiked, likes: usersLiked.length } }
          )
            .then(() =>
              res.status(200).json({ message: "la sauce a été unlikée" })
            )
            .catch((error) => res.status(400).json({ error }));
        } else {
          usersDisliked.splice(usersDisliked.indexOf(userId), 1);
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $set: {
                usersDisliked: usersDisliked,
                dislikes: usersDisliked.length,
              },
            }
          )
            .then(() =>
              res.status(200).json({ message: "la sauce a été undislikée" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      } else {
        usersDisliked.push(userId);
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $set: {
              usersDisliked: usersDisliked,
              dislikes: usersDisliked.length,
            },
          }
        )
          .then(() => res.status(200).json({ message: "la sauce a été likée" }))
          .catch((error) => res.status(400).json({ error }));
      }
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({
          error: new Error("Sauce inexistante"),
        });
      }
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({
          error: new Error("Requête non authorisée"),
        });
      } else {
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }

      const filename = sauce.imageUrl.split("/images/")[1];
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  //console.log("getAllsauce req.body = ", req);
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

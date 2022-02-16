const express = require("express");

const req = require("express/lib/request");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

//const stuffRoutes = require("./Routes/stuff");*/
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const app = express();

mongoose
  .connect(process.env.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permet d'accéder à l'API depuis n'importe quelle origine ('*')
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); //d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); //d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
  next();
});

app.use(express.json()); //Intercepte toutes les requetes qui ont comme content-type application/json et met leur body à disposition

app.use("/images", express.static(path.join(__dirname, "images"))); // Sert les images quand une requete est faites au dossier images

app.use("/api/auth", userRoutes); // A chaque fois que l'ont va à api/auth, utiliser userRoutes
app.use("/api/sauces", sauceRoutes);

module.exports = app;

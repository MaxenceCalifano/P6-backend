const express = require("express");
const helmet = require("helmet");
const session = require('express-session'); // Pour sécuriser les cookies

const req = require("express/lib/request");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false,
})); //Appel tous les middleware d'Helmet mais autorise CORS
app.use(session({  
  secret: 'HWBhliqRod',
  key: 'someCookie',
  saveUninitialized: true,
  resave: false, 
  cookie: {
    httpOnly: false,
    secure: true,
    domain: 'http://127.0.0.1:8081/',
    path: '/',
    expires: new Date( Date.now() + 60 * 60 * 1000 ) //1 heure
  }
}));

const rateLimit = require('express-rate-limit'); // Pour empécher les attaques brut force
const slowDown = require("express-slow-down"); // Ralenti 


const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});
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

app.use("/api/auth", apiLimiter, speedLimiter, userRoutes); // A chaque fois que l'ont va à api/auth, utiliser userRoutes
app.use("/api/sauces", sauceRoutes);

module.exports = app;

// Importation de express pour créer l'api
const express = require('express');

// Importation de body-parser
const bodyParser = require('body-parser');

// Importation de mongoose pour la base de données
const mongoose = require('mongoose');




// Accès au dossiers routes
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

//connection à la base de données
mongoose.connect('mongodb+srv://Jeremie:projet6@cluster0.fl7vn.mongodb.net/<dbname>?retryWrites=true&w=majority',
{ useNewUrlParser: true,
useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Permet le connection avec deux serveur différent
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());


app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;
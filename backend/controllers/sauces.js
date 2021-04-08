// Importation des dépendances et du models
const Sauce = require('../models/Sauces');
const fs = require('fs');
const { connection } = require('mongoose');

//Reçois la requête pour la création de sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'objet enregistré !'}))
    .catch(error =>res.status(400).json({ error }))
  };

//Reçois la requête pour la modification de la sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  }: {...req.body};
  Sauce.updateOne({_id:req.params.id}, {...sauceObject, _id: req.params.id})
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};
  
//Reçois la requête pour le like ou le dislike
exports.likeSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.usersLiked.find(user => user === req.body.userId)){
        Sauce.updateOne({_id: req.params.id}, {
          $inc: {likes: -1},
          $pull: {usersLiked : req.body.userId},
          _id: req.params.id
        })
        .then(sauce => res.status(201).json({sauce}))
        .catch(error => res.status(400).json({error}));
      }

      if (sauce.usersDisliked.find(user => user === req.body.userId)){
        Sauce.updateOne({_id: req.params.id}, {
          $inc: {dislikes: -1},
          $pull: {usersDisliked : req.body.userId},
          _id: req.params.id
        })
        .then(sauce => res.status(201).json({sauce}))
        .catch(error => res.status(400).json({error}));
      }

      if (req.body.like == 1){
        Sauce.updateOne({_id: req.params.id}, {
          $inc: {likes: 1},
          $push: {usersLiked : req.body.userId},
          _id: req.params.id
        })
        .then(sauce => res.status(201).json({sauce}))
        .catch(error => res.status(400).json({error}));
      }

      if (req.body.like == -1){
        Sauce.updateOne({_id: req.params.id}, {
          $inc: {dislikes: 1},
          $push: {usersDisliked : req.body.userId},
          _id: req.params.id
        })
        .then(sauce => res.status(201).json({sauce}))
        .catch(error => res.status(400).json({error}));
      }
    })
    
}
//Reçois la requête pour la suppression de la sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({_id: req.params.id})
      .then(() => res.status(200).json({message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json(error));
    });
  })
  .catch(error => res.status(500).json({ error }));
};
//Reçois la requête pour obtenir toutes les sauces
exports.allGetSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json(error));
};
//Reçois la requête pour récupérer seulement une sauce
exports.getOneThing = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json(error));
};


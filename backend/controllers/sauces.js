const Sauce = require('../models/Sauces');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked,
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'objet enregistré !'}))
    .catch(error =>res.status(400).json({ error }))
  };
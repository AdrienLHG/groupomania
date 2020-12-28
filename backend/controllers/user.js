const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const db = require('../models/index');
require("dotenv").config()


// Constants
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordValidator = require('../middleware/passwordValidator');
const nameRegex = /^[a-zÀ-ÿ\d\-.'\s]{2,30}$/i;


// Logique métier

// SIGNUP //

exports.signup = async (req, res, next) => {
  if(!nameRegex.test(req.body.username)|| !nameRegex.test(req.body.firstname) || !nameRegex.test(req.body.lastname)) {// nameRegex permet de vérifier les caractères utilisés
    return res.status(400).json({ 'error': 'the content is not valid' });
  }
  if (!emailRegex.test(req.body.email) || !emailValidator.validate(req.body.email)) {// email validator permet d'accepter un mail valide, idem pour le regex
    return res.status(400).json({ 'error': 'email is not valid' });
  }
  if (!passwordValidator.validate(req.body.password)) {
    return res.status(400).json({ 'error': 'password invalid (must length 8 - 100 and include 2 number at least)' });
  }
  const user = await db.User.create(req.body)//creation du compte utilisateur
    .catch(error => res.status(500).json({ error: 'Internal Server Error' }));//erreur 500

  user.password = await bcrypt.hash(user.password, 10);// bcrypt va permettre de masquer/crypter le password dans la base de donnée
  await user.save()// permet d'enregistrer l'utilisateur dans la base de donnée
    .then(() => res.status(201).json({userId: user.id, username: user.username, isAdmin: user.isAdmin, token: jwt.sign({ userId: user.id }, 'XyJ__L9_VU2qMq8E7r_d__428_JRz9_vv7Uz4wVX_V__5eqE__s6829_tzB', {expiresIn: '24h'})}))// 201 créé et modifiée 
    .catch(error => res.status(400).json({ error: 'Bad Request !' }));//erreur 400 mauvaise requête
};

// LOGIN// Connexion de l'utilisateur
exports.login = (req, res, next) => {

  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ 'erreur': `votre email n'est pas valide` });
  }
  if (!passwordValidator.validate(req.body.password)) {
    return res.status(400).json({ 'erreur': `Le mot de passe n'est pas valide` });
  }

  db.User.findOne({  where: { email: req.body.email } })
    .then(user => {
        if (!user){
            return res.status(401).json({ message: 'Utilisateur inexistant' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid){
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }
            res.status(200).json({
                userId: user.id,
                username: user.usernmane,
                isAdmin: user.isAdmin,
                token: jwt.sign(
                    { userId: user.id,
                    },'XyJ__L9_VU2qMq8E7r_d__428_JRz9_vv7Uz4wVX_V__5eqE__s6829_tzB',
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error: 'Internal Server Error' }));
    })
    .catch(error => res.status(500).json({ error: 'Internal Server Error' }));
};

// Find One User // 
exports.findOneUser =  (req, res, next) => {
    db.User.findOne({
      attributes: [ 'id', 'email','username'],
      where: {id: req.params.id}
    }).then(user => res.status(200).json(user))
      .catch(error => res.status(400).json({error}));
};

// Find All Users // 
exports.findAllUsers =  (req, res, next) => {
    db.User.findAll({
      attributes: ['id', 'email','username'],
    }).then(user => res.status(200).json(user))
      .catch(error => res.status(400).json({error}));
};
// Update User //
exports.updateUser = async (req, res, next) => {
    if(!nameRegex.test(req.body.username)|| !nameRegex.test(req.body.firstname) || !nameRegex.test(req.body.lastname)) { 
        return res.status(400).json({ 'erreur': `Le contenu n'est pas valide` });
      }
      if (!emailRegex.test(req.body.email) || !emailValidator.validate(req.body.email)) { 
        return res.status(400).json({ 'erreur': `L'email n'est pas valide` });
      }
      if (!passwordValidator.validate(req.body.password)) {
        return res.status(400).json({ 'erreur': `Le mot de passe n'est pas valide`});
      }

    const user =  req.body;
    user.password = await bcrypt.hash(user.password, 10);
    await db.User.update(
        req.body, 
      {where: { id: req.body.id }
    }).then(() => res.status(200).json({message: 'Utilisateur modifié !'}))
    .catch(error => res.status(500).json({error}));
  };


// Delete user // 
  exports.deleteUser = (req, res, next) => {
    db.User.destroy({
        where: { id: req.params.id }
        
      }).then(() => res.status(200).json({message: 'Utilisateur supprimé !'}))
        .catch(() => res.status(400).json({message: 'Le compte n\'existe pas'}));
  };
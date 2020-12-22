const db = require('../models/index');
const fs = require('fs');// on importe file system de node pour avoir accès aux différentes opérations liées fichiers
const jwt = require('jsonwebtoken');// on importe jwt pour vérifier nos tokens

//constants
const titleRegex = /^[a-zÀ-ÿ\d\-.'!:;)(?+\s]{2,30}$/i;
const contentRegex = /^[a-zÀ-ÿ\d\-.',!?;:)(+\s]{0,250}$/i;
const regexNumber = /^\d+$/;
const ITEMS_LIMIT   = 50;


// Logique métier

// CREATE MESSAGE // Création d'un message
exports.createMessage = (req, res, next) => {
    // Permet de voir le corps de la requête 
    console.log(req.body);

    if (!titleRegex.test(req.body.title)) {// regex pour avoir un titre qui contient entre 2 et 30 caractères
      return res.status(400).json({ 'error': 'Votre titre doit faire entre 2 et 30 caractères' });
    }

    if (!contentRegex.test(req.body.content)) { // regex pour avoir un contenu qui contient entre 2 et 30 caractères
      return res.status(400).json({ 'error': 'Votre contenu ne peut contenir plus de 250 caractères' });
    }

    if(!regexNumber.test(req.body.userId) || !regexNumber.test(req.body.likes) ){
      return res.status(400).json({ 'error': 'Votre requête a échouée !' });// la requête ne peut contenir que des chiffres
    }
          
    db.User.findOne({//On récupère l'id de l'user pour l'ajouter à la création du message
      where: { id: req.body.userId }})
    .then(user => {
      if( req.body.image == 'undefined' ){
        return db.Message.create({
            UserId: user.id,
            title: req.body.title,
            attachment:  null,
            content: req.body.content,
            likes: 0,
            })
            .then(message =>  res.status(201).json(message))// code 201, message créé. Dans la réponse on aura le contenu complet de notre message
            .catch(() => res.status(400).json({ 'error': 'contenu invalide' }));// code 400 mauvaise requête dû au mauvais contenu
        } else{
            return db.Message.create({
            UserId: user.id,
            title: req.body.title,
            attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` ,
            content: req.body.content,
            likes: 0,
        
            })
            .then(message =>  res.status(201).json(message))// code 201, message créé. Dans la réponse on aura le contenu complet de notre message
            .catch(() => res.status(400).json({ 'error': 'contenu invalide' }));// code 400 mauvaise requête dû au mauvais contenu
        }
    })
    .catch(() =>  res.status(500).json({ 'error': 'Problème serveur' }));
  };


// GET ALL MESSAGES // récuperer tout les messages
exports.findAllMessages = (req, res, next ) => {
  console.log(req.body)
    let fields  = req.query.fields;
    let order   = req.query.order;

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }
    
    db.Message.findAll({
      order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      include: [{// on inclut le model du créateur de l'image (son pseudo)
        model: db.User,
        attributes: ['username']
      }]})
      .then(message => { return res.status(200).json(message)})// code 200 ok, la réponse nous retourne tous les messages grace au findAll.
      .catch(() => {res.status(500).json({ "error": "Il n'y a pas de message" })}); // les messages n'éxistent pas ou un problème serveur
  };
   
  
// GET ONE MESSAGE // récuperer un message
exports.findOneMessage = (req, res, next) => {
  db.Message.findOne({  where: {id: req.params.messageId},
    include: [{
      model: db.User,
      attributes: ['id','username'], include: [{
        model: db.Like,
        attributes: ['id','userId'],
      }] 
    },{ model: db.Comment,
    attributes: [ 'id','content', 'createdAt'],  include: [{
      model: db.User,
      attributes: ['id','username'],
    }] 
  }]
}).then(message => { return res.status(200).json(message)})// code 200 ok, la réponse nous retourne tout le message demandé grace au findOne.
  .catch(() => {res.status(500).json({ "error": "Ce message n'existe pas" })});// le message n'éxiste pas ou un problème serveur

};


// UPDATE MESSAGE // Modifier un message
exports.updateMessage = (req, res, next) => {
  console.log(req.body);
  
  if (!titleRegex.test(req.body.title)) {// regex pour avoir un titre qui contient entre 2 et 30 caractères
    return res.status(400).json({ 'error': 'Votre titre doit faire entre 2 et 30 caractères' });
  }

  if (!contentRegex.test(req.body.content)) { // regex pour avoir un contenu qui contient entre 2 et 30 caractères
    return res.status(400).json({ 'error': 'Votre contenu ne peut contenir plus de 250 caractères' });
  }

  if(!regexNumber.test(req.body.userId) || !regexNumber.test(req.body.likes) || !regexNumber.test(req.body.likes) ){
    return res.status(400).json({ 'error': 'Votre requête a échouée !' });// la requête ne peut contenir que des chiffres
  }

  db.User.findOne({
    where: {id: req.body.userId},// on récupère l'user dans la base de donnée
  }).then(user => {
    db.Message.findOne({
      where: {id: req.params.messageId},// // on récupère le message dans la base de donnée
    }).then(message => { 
      if(message.UserId == user.id || user.isAdmin === true ){// On vérifie si c'est le créateur de l'image ou l'admin sinon on bloque
        if(req.body.image == 'undefined'){// si on modifie sans ajouter d'image 
          return db.Message.update({
            ...req.body,
              attachment:  null,
              },
              {where: { id: req.params.messageId },
              

            }, db.Like.destroy({where :{messageId : message.id}}))
              .then(() =>  res.status(200).json('message modifié'))// code 200 ok, le message est modifié
              .catch(() => res.status(400).json({ 'error': 'contenu invalide' })); // 400 mauvaise requête du au mauvais contenu
        } else{
            return db.Message.update({// si on modifie en changeant d'image
              ...req.body,
            attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` ,
  
            },
            {where: { id: req.params.messageId }
          }, db.Like.destroy({where :{messageId : message.id}}))
            .then(() =>  res.status(200).json('message modifié'))//le message est modifié
            .catch(() => res.status(400).json({ 'error': 'contenu invalide' }));// le contenu n'est pas correcte
          }
      } else {// si ce n'est pas l'user ou l'admin on envoie un code 401
        return res.status(403).json('Accès non autorisé !')
      }
        
    })// on envoie un code 500 dû a une erreur serveur ou le message n'éxiste pas
     .catch(() => {res.status(500).json({ "error": "Problème serveur" })});
  })// on envoie un code 500 dû a une erreur serveur ou l'user n'éxiste pas
  .catch(() => {res.status(500).json({ "error": "Problème serveur" })});
};


// DELETE MESSAGE // supprimer un message
exports.deleteMessage =  (req, res, next) => {

  const token = req.headers.authorization.split(' ')[1];// on va recuperer notre token qui est en deuxième élèment du tableau donc 1 et le bearer en 0
  const decodedToken = jwt.verify(token, 'XyJ__L9_VU2qMq8E7r_d__428_JRz9_vv7Uz4wVX_V__5eqE__s6829_tzB');// on va décoder le token, donc on verifie le token et en deuximème argument la clé secrète
  const userId = decodedToken.userId;// on souhaite récuperer l'userId qu'on a encodé 

  db.User.findOne({// on récupère l'user qui fait la requête
    where: {id: userId},
  }).then(user => {
      db.Message.findOne({where: { id: req.params.messageId }})// on recupère le message demandé
      .then(message => {
        if(message.UserId == user.id || user.isAdmin === true ){// On vérifie si c'est le créateur de l'image ou l'admin sinon on bloque
          if(message.attachment === null){
            db.Message.destroy({
              where: { id: req.params.messageId }
              
            }).then(() => res.status(200).json({message: 'Message supprimé!'}))// le message est supprimé
              .catch(error => res.status(400).json({error}));// le contenu n'est pas correct
          }else{
            const filename = message.attachment.split('/images/')[1];// on extrait le nom du fichier à supprimer
          fs.unlink(`images/${filename}`, () => {// fs.unlink permet de supprimer le fichier, après on a le chemin du fichier entre paranthèse
            db.Message.destroy({
                where: { id: req.params.messageId }
                
              }).then(() => res.status(200).json({message: 'Message supprimé!'}))// le message est supprimé
                .catch(error => res.status(400).json({error}));// le contenu n'est pas correct
            });
          }
          
        } else { // si ce n'est pas l'user ou l'admin on envoie un code 401
          return res.status(403).json('Accès non autorisé !')
        }
      })// on envoie un code 500 dû a une erreur serveur ou le message n'éxiste pas
      .catch(error => res.status(500).json({ error }));
  })// on envoie un code 500 dû a une erreur serveur ou l'user n'éxiste pas
  .catch(() => {res.status(500).json({ "error": "Problème serveur" })});
};
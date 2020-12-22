const db = require('../models/index');// on importe nos models
const contentRegex = /^[a-zÀ-ÿ\d\-.':)(+;,_!?\s]{0,250}$/i;// regex pour le contenu de nos messages
const jwt = require('jsonwebtoken');// on importe jwt pour vérifier nos tokens
// Logique métier

exports.createComment = (req, res, next) => {
    // Permet de voir le corps de la requête 
    console.log(req.body);
    if (!contentRegex.test(req.body.content)) {// on vérifie si le contenu est correct
      return res.status(400).json({ 'error': 'Votre contenu ne peut contenir plus de 250 caractères' });
    }
    
    db.Message.findOne({where: { id: req.params.messageId }})// on récupère le message pour lui ajouter un commentaire
    .then(message => {
        db.Comment.create({
            UserId: req.body.userId,
            messageId: message.id,
            content: req.body.content,
        })
        .then(() =>  res.status(201).json('commentaire créé'))
        .catch(() => res.status(400).json({ error: 'contenu invalide' }));
    })
    .catch(() =>  res.status(500).json({ error: 'Problème serveur' }));
};


// GET ONE MESSAGE // on récupère un commentaire avec l'utilisateur qui la créé grace au include
exports.getOneComment =  (req, res, next) => {
    console.log(req.params.commentId);
    console.log(req.params.userId);
    
    const token = req.headers.authorization.split(' ')[1];// on va recuperer notre token qui est en deuxième élèment du tableau donc 1 et le bearer en 0
    const decodedToken = jwt.verify(token, 'XyJ__L9_VU2qMq8E7r_d__428_JRz9_vv7Uz4wVX_V__5eqE__s6829_tzB');// on va décoder le token, donc on verifie le token et en deuximème argument la clé secrète
    const userId = decodedToken.userId;// on souhaite récuperer l'userId qu'on a encodé

    db.User.findOne({
        where: {id: userId},// on récupère l'user dans la base de donnée
      }).then(user => {
        db.Comment.findOne({ where: { id: req.params.commentId },
            include: [{
            model: db.User,
            attributes: ['id','username']  
        }]
        }).then(comment => {
            if(user.id == comment.UserId || user.isAdmin === true){// on verifie si c'est bien le créateur du commentaire ou l'admin qui souhaite voir le commentaire
                return res.status(200).json(comment);
            } else{
                return res.status(401).json({message: "accès non autorisée"});
            }
        })
        .catch(() => {res.status(400).json({ message : "Ce commentaire n'existe pas" })});
    })
    .catch(() => {res.status(500).json({ message: "Cet utilisateur n'existe pas" })});
};

exports.getAllComment = (req, res, next) => {
    const order = req.query.order
    
    models.Comment.findAll({
        order: [(order != null ? order.split(':') : ['createdAt', 'DESC'])],
        include:[{ model: models.User, attributes: [ 'firstname', 'lastname']}]
    })
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(500).json(log(error)))
}

// DELETE ONE COMMENT // on supprime un commentaire
exports.deleteComment = async (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];// on va recuperer notre token qui est en deuxième élèment du tableau donc 1 et le bearer en 0
    const decodedToken = jwt.verify(token, 'XyJ__L9_VU2qMq8E7r_d__428_JRz9_vv7Uz4wVX_V__5eqE__s6829_tzB');// on va décoder le token, donc on verifie le token et en deuximème argument la clé secrète
    const userId = decodedToken.userId;// on souhaite récuperer l'userId qu'on a encodé
    
    db.User.findOne({
        where: {id: userId},// on récupère l'user dans la base de donnée
      }).then(user => {
        db.Comment.findOne({
            where: { id: req.params.commentId },
        }).then(comment => {
            if(user.id == comment.userId || user.isAdmin === true){ // on verifie si c'est bien le créateur du commentaire ou l'admin qui souhaite voir le commentaire
                db.Comment.destroy({
                    where: { id: req.params.commentId }
                })
                .then(() => res.status(200).json({message: 'Commentaire supprimé!'}))
                .catch(error => res.status(400).json({error}));
            } else{// si ce n'est ni l'user qui a créé le message et ni l'admin on lui envoie un code 401 non autorisé
              return res.status(401).json({ message: 'accès non autoriée'});
            }
            
        })
        .catch(error => res.status(400).json({error}));// mauvaise requête
     

})
.catch(() => {res.status(500).json({ error: "Cet utilisateur n'existe pas" })});// code 500 problème serveur
    
};
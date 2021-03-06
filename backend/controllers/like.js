const models = require('../models/index');



// Logique métier

// Like // création d'un like ou le supprimer
exports.likeMessage = (req, res, next) => {

  const userId = req.body.userId;// constante qui contient l'userId
  const messageId = req.params.id;// constante qui contient le messageId

  if (messageId <= 0 ) {// on vérifie si le messageId est égal ou inférieur à 0 sinon on envoie un message d'erreur
    return res.status(400).json({ error: 'Paramètres du message sont érronées' });
  }
  if (userId <= 0 ) {// on vérifie si l'userId est égal ou inférieur à 0 sinon on envoie un message d'erreur
    return res.status(400).json({ error: 'Paramètres du message sont érronées' });
  }

  models.Message.findOne({ where: { id: messageId } })// on vérifie l'id du message
  .then(message => {
    if (message) {
      models.User.findOne({  where: {id: userId }})// on vérifie l'id de l'user 
        .then(user => {
          if (user) {// si l'user existe on continue sinon code 401 contenu dans le else
            models.Like.findOne({ where: { userId: userId, messageId: messageId }})// on cherche le like s'il existe 
              .then(like => {
                if (!like) {//s'il n'exsite pas, on créé un like pour ce message, on met 1 dans le likeType qui nous permettra de savoir que l'utilisateur a liké.
                  models.Like.create({
                    messageId: message.id, 
                    userId: user.id,
                    isLike: 1
                  })
                  .then(() => {
                    message.update({// on modifie la colonne likes dans le message correspondant en ajoutant +1
                        likes: message.likes + 1
                    })
                    .then(()=>  res.status(201).json(message));// on envoie la reponse contenant le message avec le likes modifié
                  })
                  .catch(error => res.status(500).json({ error }));// erreur serveur

                } else if (like && (like.isLike == 1)) {// si on souhaite retirer notre like on vérifie si liké et que le likeType est égal à 1 si oui on le modifie et on retire 1 au likes dans message.
                 like.update({ likeType: 0}, { where: { messageId: message.id, userId: user.id
                  }})
                    .then(() => {
                      message.update({
                          likes: message.likes - 1
                      })
                      .then(() => {
                        model.Like.destroy({// on détruit le like
                          where: {id: like.id}
                        }).then(() => res.status(200).json('like supprimé'))
                      });
                      })
                      .catch(error => { return res.status(500).json({ error })});  
                }
              })
              .catch(error => { return res.status(500).json({ error })});
          }  else {
            return res.status(401).json({ message:'Utilisateur inconnu' });// si l'utilisateur n'existe pas on bloque
          }        
        })
    }       
  }) 
};
const models = require('../models')
const jwt = require('jsonwebtoken')

exports.createComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN )
    const userId = decodedToken.userId;


    console.log(req.body.id)
   
    models.Comment.create({
        
        comment: req.body.comment,
        UserId: userId,
        PostId: req.body.postId,
    })
    .then((comment) => res.status(200).json(comment))
    .catch(error => res.status(400).json(error))
        
    
}

exports.getOneComment = (req, res, next) => {
    models.Comment.findOne({ where: {id: req.params.id},include: ['username']})
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(500).json(log(error)))
}

exports.getAllComment = (req, res, next) => {
    const order = req.query.order
    
    models.Comment.findAll({
        order: [(order != null ? order.split(':') : ['createdAt', 'DESC'])],
        include:[{ model: models.User, attributes: [ 'firstname', 'lastname']}]
    })
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(500).json(log(error)))
}

exports.deleteComment = (req, res, next) => {
    models.Comment.destroy({ where: {id: req.params.id}})
        .then(() => res.status(200).send({message: 'Vous avez supprimé un commentaire!'}))
        .catch((error) => res.status(500).send(error))
}


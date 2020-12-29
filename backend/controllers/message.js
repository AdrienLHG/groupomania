const models = require('../models')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const Message = require('../models/message')

require('dotenv').config()


// create posts and get ressources with multer
exports.createMessage = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'XyJ__L9_VU2qMq8E7r_d__428_JRz9_vv7Uz4wVX_V__5eqE__s6829_tzB');// on va décoder le token, donc on verifie le token et en deuximème argument la clé secrète
    const userId = decodedToken.userId;
    models.Message.create({ 
        UserId: userId,
        content: req.body.content,
        attachment: (req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null)
    })
    .then((message) => res.status(201).json(message))
    .catch(error => res.status(500).json(error))
}

// get one post with id 
exports.findOneMessage = (req, res, next) => {

    models.Message.findOne({ where: {id: req.params.id},include: ['username']})
    .then((message) => res.status(200).send(message))
    .catch((error) => res.status(500).send(error))

}


// get all posts from database
exports.findAllMessages = (req, res, next) => {
    const order = req.query.order
    
    models.Message.findAll({
        order: [(order != null ? order.split(':') : ['createdAt', 'DESC'])],
        include:[{ model: models.User, attributes: ['username']}]
    })
    .then(messages => res.status(200).json(messages))
    .catch(error => res.status(500).send(error))
};


// update post
exports.updateMessage = (req, res, next) => {
    models.Message.update({ where: {id: req.params.id}})
        .then(() => res.status(200).send({message: 'Vous avez modifié votre publication!'}))
        .catch((error) => res.status(400).send(error))      
}



// delete post 
exports.deleteMessage = (req, res, next) => {

    models.Message.destroy({ where: {id: req.params.id}})
        .then(() => res.status(200).send({message: 'Vous avez supprimé une publication!'}))
        .catch((error) => res.status(500).send(error))

}
const { Router } = require('express');
const router = Router();
const NotificationHandler = require('../handlers/notifications.handler')


//Defino las rutas para las notificaciones

//En cada caso ejecuto un "execute" correspondiente 
//a lo que necesite que haga ese endpoint

router.post('/notifications/one-user', (req, res) => {
    NotificationHandler.executeToOneUser(req, res);
})

router.post('/notifications/topic/:topic', (req, res) => {
    NotificationHandler.executeToTopic(req, res);
})

router.post('/notifications/subscribe', (req, res) => {
    NotificationHandler.executeSubscribeToTopic(req, res);
})

module.exports = router;
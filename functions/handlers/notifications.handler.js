const NotificationRepository = require('../repositories/notification.repository');

// En el handler valido que los datos de la request estén correctos,
// si es así se ejecuta la función del repositorio correspondiente

//Notificaciones para un usuario
async function executeToOneUser(req, res) {
    try {
        
        if (!req.body.token || req.body.token == "" || typeof req.body.token != "string") {
            res.status(400).json({message: "Ingrese correctamente el valor 'token'"});
            return;
        }
        
        if (!req.body.title || req.body.title == "" || typeof req.body.title != "string") {
            res.status(400).json({message: "Ingrese correctamente el valor 'title'"});
            return;
        }
        
        if (req.body.body && (req.body.body == "" || typeof req.body.body != "string")) { 
            res.status(400).json({message: "Ingrese correctamente el valor 'body'"});
            return;
        }
        
        const message = {
            token: req.body.token,
            notification: {
                title: req.body.title,
                body: req.body.body
            }
        }
        const response = await NotificationRepository.sendMessage(message)

        if (response == 200) {
            res.status(200).json({message: "Notificación enviada correctamente"});
        } else {
            res.status(500).send(response);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}


// Notificaciones para tópicos
async function executeToTopic(req, res) {
    try {
        if (!req.params.topic || req.params.topic == "" || typeof req.params.topic != "string") {
            res.status(400).json({message: "Ingrese correctamente el parámetro 'topic'"});
            return;
        }
        
        if (!req.body.title || req.body.title == "" || typeof req.body.title != "string") {
            res.status(400).json({message: "Ingrese correctamente el valor 'title'"});
            return;
        }
        
        const message = {
            topic: req.params.topic,
            notification: {
                title: req.body.title,
                body: req.body.body
            }
        }
        const response = await NotificationRepository.sendMessage(message)
        
        if (response == 200) {
            res.status(200).json({message: "Notificación enviada correctamente"});
        } else {
            res.status(500).send(response);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}


// Suscribir un usuario a un tópico
async function executeSubscribeToTopic(req, res) {
    try {
        if (!req.body.topic || req.body.topic == "" || typeof req.body.topic != "string") {
            res.status(400).json({message: "Ingrese correctamente el parámetro 'topic'"});
            return;
        }
        
        if (!req.body.token || req.body.token == "" || typeof req.body.token != "string") {
            res.status(400).json({message: "Ingrese correctamente el valor 'token'"});
            return;
        }
        
        const response = await NotificationRepository.subscribe(req.body.token, req.body.topic)

        if (response == 200) {
            res.status(200).json({message: "Usuario subscrito correctamente al topic: " + req.body.topic});
        } else {
            console.log(response);
            res.status(500).send(response);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = { executeToOneUser, executeToTopic, executeSubscribeToTopic };
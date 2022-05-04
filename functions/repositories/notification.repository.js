const admin = require('firebase-admin');

// Defino las funciones que realizan la tarea específica

//Esta función se ejecuta tanto para enviar Notificaciones
//para un usuario como para un tópico, solo varía el "message"
async function sendMessage(message) {
    const response = await admin.messaging().send(message)
        .then(() => {
            return 200;
        }).catch((error) => {
            return error;
        });
    return response;
}


// Ejecuto el sdk de firebase para suscribir el usuario 
//al tópico especificado en la request
async function subscribe(token, topic) {
    tokens = [token]
    const response = await admin.messaging().subscribeToTopic(tokens, topic)
        .then(() => {
            return 200;
        })
        .catch((error) => {
            console.log('Error subscribing to topic:', error);
            return error;
        });
    return response;
}

module.exports = { sendMessage, subscribe }
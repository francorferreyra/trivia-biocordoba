const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const app = express();

// Inicializo Firebase con el token
function initFirebase() {
    admin.initializeApp({
        credential: admin.credential.cert('./keys/service-account.json')
    });
}
initFirebase();

// Inicializo las rutas de las notificaciones
app.use(require('./routes/notifications.routes'));

exports.app = functions.https.onRequest(app); 

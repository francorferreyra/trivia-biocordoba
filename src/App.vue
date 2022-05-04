<template>
  <router-view />
</template>
<script>
import { PushNotifications } from "@capacitor/push-notifications"
export default {
  name: "App",
  setup() {
    // PushNotifications.register();

    // PushNotifications.addListener(
    //   "registration",
    //   (token) => {
    //     console.log("Push registration success, token: " + token.value);
    //   }
    // );
    
    //Se ejecuta al ocurrir un error al registrar el dispositivo
    // PushNotifications.addListener("registrationError", (error) => {
    //   alert("Error on registration: " + JSON.stringify(error));
    // });

    //Se ejecuta al recibir la notificacion
    // PushNotifications.addListener(
    //   "pushNotificationReceived",
    //   (notification) => {

    //     let alertRet = Modals.alert({
    //       title: notification.title,
    //       message: notification.body,
    //     });
    //   }
    // );

    //Se ejecuta al tocar la notificación
    // PushNotifications.addListener(
    //   "pushNotificationActionPerformed",
    //   (notification) => {
    //     console.log("Push action performed: " + notification);
    //   }
    // );

    return {};
  },
};
</script>

<style>
#q-app {
  font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.text-indigo-9 {
  color: #003882 !important;
}
</style>

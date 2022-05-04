<template>
  <q-page class="flex-top text-center">
    <div class="row">
      <div class="col-12">
        <q-img
          src="../../assets/img/logo.png"
          alt="Hola"
          style="width: 90%; margin-top: 5%"
        />
      </div>
      <div class="col-12 q-mt-md">
        <span class="text-weight-bold text-h6">Email</span>
        <q-input
          :input-style="{
            'font-size': '20px',
            'text-align': 'center',
            color: 'black',
          }"
          :dense="true"
          type="email"
          @keypress.enter="focusPasword"
          required
          v-model="email"
          bg-color="white"
          outlined
        />
      </div>
      <div class="col-12 q-mt-sm">
        <span class="text-weight-bold text-h6">Contraseña</span>
        <q-input
          :input-style="{
            'font-size': '20px',
            'text-align': 'center',
            color: 'black',
          }"
          :dense="true"
          ref="inputPassword"
          @keypress.enter="login"
          required
          :type="isPwd ? 'password' : 'text'"
          v-model="password"
          bg-color="white"
          outlined
          id="password"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            /> </template
        ></q-input>
      </div>
      <div class="col-12 q-my-sm">
        <span
          @click="newPassword"
          class="text-weight-bold text-indigo-9"
          style="font-size: 17px"
          >Olvidé mi contraseña</span
        >
      </div>
      <div class="col-12 q-mt-lg" style="width: 50%; margin: 20px auto 0 auto">
        <q-btn
          @click="login"
          rounded
          style="background-color: #003882; color: white"
          class="full-width"
          :dense="true"
          size="23px"
          ><span class="text-weight-bold">INGRESAR</span></q-btn
        >
      </div>
      <div class="col-12 q-mt-sm">
        <router-link
          to="/register"
          class="text-weight-bold text-h6 text-indigo-9"
          style="text-decoration-line: none"
          >Regístrate</router-link
        >
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";
import PublicFunction from "../../classes/PublicFunction";
import UserRepository from "../../classes/repositories/user.repository";

export default {
  name: "TransitaSeguro-Login",
  setup() {
    const inputPassword = ref(null);
    const email = ref("");
    const password = ref("");
    const isPwd = ref(true);
    const $q = useQuasar();
    const router = useRouter();
    const auth = getAuth();
    const emailRecover = ref("");

    onBeforeMount(() => {
      signOut(auth);
      let gameMode = localStorage.getItem("tipoJuego");
      if (gameMode != "trivia") {
        router.push({ path: "/" });
      }
    });

    async function login() {
      if (email.value == "") {
        $q.notify({
          type: "warning",
          message: "Ingrese el Email",
          timeout: 1000,
        });
      } else if (password.value == "") {
        $q.notify({
          type: "warning",
          message: "Ingrese la Contraseña",
          timeout: 1000,
        });
      } else {
        try {
          const signIn = await UserRepository.signIn(
            auth,
            email.value,
            password.value
          );
          if (signIn[0] == 200) {
            setLocalStorageUser(signIn[1]);
          } else if (signIn[0] == 400 && signIn[1] == "wrong-password") {
            $q.notify({
              type: "negative",
              message: "Contraseña incorrecta",
              timeout: 1000,
            });
          } else if (signIn[0] == 400 && signIn[1] == "user-not-found") {
            $q.notify({
              type: "negative",
              message: "Mail no registrado",
              timeout: 1000,
            });
          } else {
            $q.notify({
              type: "negative",
              message: "Error al loguear usuario",
              timeout: 1000,
            });
          }
        } catch (error) {
          console.log(error);
          $q.notify({
            type: "negative",
            message: "Error al procesar los datos",
            timeout: 1000,
          });
        }
      }
    }

    async function setLocalStorageUser(uid) {
      try {
        const user = await UserRepository.getOneDbBy("uid", uid);
        const userId = Object.keys(user[0])[0];
        const tokenGet = await UserRepository.setDeviceToken(userId);

        //Acá debería hacer una petición al axios suscribiendo al usuario
        //a un tópico en específico.

        if (user !== 400) {
          localStorage.setItem("nombre", user[0][userId].nombre);
          localStorage.setItem("apellido", user[0][userId].apellido);
          localStorage.setItem("dni", userId);
          localStorage.setItem("bloquear", user[0][userId].bloquear);
          localStorage.setItem("puntosGanador", 0);
          localStorage.setItem("todosTerminan", false);
          localStorage.setItem("totalPlayers", 0);

          router.push({ path: "/game/searchroom" });
        } else {
          $q.notify({
            type: "negative",
            message: "Error al loguear usuario",
            caption: "Si el problema persiste contáctenos",
            timeout: 3000,
          });
        }
      } catch (error) {
        console.log("-----------SUBS------------");
        console.log(error);
        $q.notify({
          type: "negative",
          message: "Error al loguear usuario",
          caption: "Si el problema persiste contáctenos",
          timeout: 3000,
        });
      }
    }

    function newPassword() {
      $q.dialog({
        title: "Correo de restablecimiento de contraseña",
        message: "Ingrese su Email",
        prompt: {
          model: "",
          type: "email",
        },
        ok: "Enviar correo",
        cancel: true,
        cancel: "Cancelar",
        persistent: false,
      }).onOk((data) => {
        if (data != "") {
          sendEmailRecoverPassword(data);
        }
      });
    }

    async function sendEmailRecoverPassword(email) {
      const emailSent = await PublicFunction.sendEmailRecoverPassword(
        auth,
        email
      );
      switch (emailSent) {
        case 200:
          $q.notify({
            type: "positive",
            message: "Correo electrónico de restablecimiento enviado",
            timeout: 2000,
          });
          break;
        case "invalid-email":
          $q.notify({
            type: "negative",
            message: "Email inválido",
            timeout: 2000,
          });
          break;
        case "user-not-found":
          $q.notify({
            type: "negative",
            message: "El mail ingresado no se encuentra registrado",
            timeout: 2000,
          });
          break;
        default:
          $q.notify({
            type: "negative",
            message:
              "Error al enviar el correo electrónico de restablecimiento",
            timeout: 2000,
          });
          break;
      }
    }

    function focusPasword() {
      inputPassword.value.focus();
    }

    return {
      focusPasword,
      inputPassword,
      email,
      password,
      isPwd,
      login,
      newPassword,
      emailRecover,
    };
  },
};
</script>

<style scoped>
.q-page {
  background: url("src/assets/img/fondo02.jpg") no-repeat center top/cover;
}
.q-input {
  width: 85%;
  margin: auto;
}
</style>

<template>
  <q-form @submit="login">
    <div class="row text-center" style="width: 90%; margin: auto">
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
      <div class="col-12 q-mt-lg" style="width: 50%; margin: 20px auto 0 auto">
        <q-btn
          type="submit"
          rounded
          style="background-color: #003882; color: white"
          class="full-width"
          :dense="true"
          size="23px"
          ><span class="text-weight-bold">INGRESAR</span></q-btn
        >
      </div>
    </div>
  </q-form>
</template>

<script>
import { getAuth, signOut, signIn } from "firebase/auth";
import { ref, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import UserRepository from "../../classes/repositories/user.repository";

export default {
  name: "SorteoLogin",

  setup(props, context) {
    const isPwd = ref(true);
    const email = ref("");
    const password = ref("");
    const auth = getAuth();
    const $q = useQuasar();

    onBeforeMount(() => {
      signOut(auth);
    });

    async function login() {
      try {
        if (password.value == "") {
          $q.notify({
            type: "warning",
            message: "Ingrese la contraseña",
            timeout: 1000,
          });
        } else if (email.value == "") {
          $q.notify({
            type: "warning",
            message: "Ingrese un email",
            timeout: 1000,
          });
        } else {
          const signIn = await UserRepository.signIn(
            auth,
            email.value,
            password.value
          );

          if (signIn[0] == 200) {
            verifyUid(signIn[1]);
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

    async function verifyUid(uid) {
      const dataAdmin = await UserRepository.getDataUserDbBy(
        "users",
        "43132936"
      );

      if (dataAdmin.uid == uid) {
        context.emit("loginChecked");
      } else {
        $q.notify({
          type: "negative",
          message: "La cuenta ingresada no es admin",
          timeout: 1000,
        });
      }
    }

    return { isPwd, email, password, login };
  },
};
</script>

<style></style>

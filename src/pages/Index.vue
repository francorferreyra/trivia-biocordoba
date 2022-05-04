<template>
  <q-page class="text-center flex-top">
    <q-img
      src="../assets/img/logo.png"
      alt="Hola"
      style="width: 90%; margin-top: 5%"
    />
    <q-img
      src="../assets/img/hola.png"
      alt="Hola"
      style="width: 50%; margin-top: 2%"
    />
    <div class="q-mt-md" style="width: 90%; margin: auto">
      <p class="textJugar">¿Arrancamos a jugar?</p>
      <p class="text2Jugar">
        Pero antes, acordate de <br />
        ponerte el cinturón y el casco.
      </p>
    </div>
    <div class="row" style="padding-top: 10px; width: 90%; margin: auto">
      <div class="col-xs-6" style="width: 50%; padding-right: 5px">
        <div @click="saveGame('trivia')" id="juegoTrivia" class="juegos">
          <img
            src="../assets/img/preguntas-ruteras.png"
            style="width: 100%"
            alt="Juego de Trivia"
          />
        </div>
      </div>
      <div class="col-xs-6" style="width: 50%; padding-left: 5px">
        <div
          id="juegoUnion"
          data-toggle="modal"
          @click="goGameUnion"
          data-target="#myModal"
          class="juegos"
        >
          <img
            src="../assets/img/juego-de-union.png"
            style="width: 100%"
            alt="Juego de Unión"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useRouter } from "vue-router";
import { onBeforeMount, ref } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useQuasar } from "quasar";

export default {
  name: "TransitaSeguro-Index",
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const $q = useQuasar();

    onBeforeMount(() => {
      localStorage.clear();
      signOut(auth);
    });

    function saveGame(game) {
      localStorage.setItem("tipoJuego", game);
      router.push({ path: "/login" });
    }

    function goGameUnion() {
      $q.dialog({
        title: "<p class='text-center'>Juego de Unión</p>",
        message:
          "<p class='text-center' style='margin-top: -20px'>¡Estás por jugar a Arrastrá Señales!<br/> A medida que vas jugando el reloj se va acelerando ¡así que apurate! <br/>El juego termina cuando se acaba el tiempo.</p>",
        html: true,
        ok: {
          push: true,
          color: "indigo-10",
          label: "Jugar",
        },
        cancel: {
          push: true,
          color: "negative",
          label: "Cancelar",
        },
        persistent: false,
      }).onOk(() => {
        router.push({ path: "/gameunir" });
      });
    }

    return {
      saveGame,
      goGameUnion,
    };
  },
};
</script>

<style scoped>
.q-page {
  background: url("src/assets/img/fondo01.jpg") no-repeat center bottom/cover;
}
.textJugar {
  line-height: 30px;
  font-size: 30px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 2px;
  color: #454d54;
}
.text2Jugar {
  padding-top: 10px;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  color: #454d54;
}
</style>

<template>
  <q-page class="flex-top text-center">
    <div class="row justify-center">
      <div class="col-12">
        <q-img
          src="../../assets/img/logo.png"
          alt="Hola"
          style="width: 90%; margin-top: 5%"
          class="q-mb-md"
        />
      </div>
      <div class="col-12" style="width: 80%; margin: auto">
        <span class="text-weight-bold">Código de la Sala</span>
        <div class="col-12 text-center">
          <div class="form-group" style="margin: auto">
            <input
              v-model="codGame"
              ref="inputCode"
              class="form-field"
              type="text"
              disabled
            />
            <span style="background-color: #003882 !important"
              ><q-icon
                @click="copyCod"
                class="text-white"
                name="fas fa-copy"
              ></q-icon
            ></span>
          </div>
        </div>
      </div>
      <div class="q-mt-lg q-mb-md" style="width: 90%">
        <span class="text-weight-bold text-h5 text-grey-14">Participantes</span>
        <q-table
          :rows="rows"
          :columns="columns"
          v-model:pagination="pagination"
          row-key="name"
          :rows-per-page-options="[0]"
          style="max-height: 250px"
        />
      </div>
      <div v-if="buttonComenzar">
        <div class="col-12">
          <span class="text-weight-bold"
            >En caso de no comenzar partida,<br />
            la sala se anulará en:</span
          >
          <q-btn
            round
            style="background-color: #003882; color: white"
            class="q-ml-sm"
            size="15px"
            :label="time"
          />
        </div>
        <div style="width: 100%" class="q-mb-sm">
          <q-btn
            class="q-mt-md full-width"
            rounded
            @click="runGame"
            style="background-color: #003882; color: white"
            :dense="true"
            size="25px"
            ><span>COMENZAR</span></q-btn
          >
        </div>
        <span
          class="text-weight-bold text-h6"
          style="color: #003882"
          @click="backSearch"
          >Volver</span
        >
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onBeforeMount, watchEffect, watch } from "vue";
import { useRouter } from "vue-router";
import { rtdb } from "../../boot/firebase";
import {
  ref as firebaseRef,
  onValue,
} from "firebase/database";
import { useQuasar } from "quasar";
import RoomRepository from "../../classes/repositories/room.repository";

export default {
  name: "Waiting-Room",
  setup() {
    const router = useRouter();
    const codGame = ref("");
    const inputCode = ref(null);
    const buttonComenzar = ref(false);
    const playing = ref(false);
    const $q = useQuasar();
    const dni = ref(localStorage.getItem("dni"));
    const time = ref(null);
    const dniCreator = ref(null);
    const closeRoom = ref(false);
    const salaCode = ref(localStorage.getItem("codigoSala"));
    const columns = [
      {
        name: "name",
        required: true,
        label: "Nombre",
        align: "center",
        field: (row) => row.name,
      },
      {
        name: "Surname",
        required: true,
        label: "Apellido",
        align: "center",
        field: (row) => row.surname,
      },
    ];
    const rows = ref([]);

    onBeforeMount(() => {
      toBackInit();
      codGame.value = localStorage.getItem("codigoSala");
      players();
    });

    watchEffect(() => {
      playing.value, startGame();
    });

    watchEffect(() => {
      closeRoom.value, exitRoom();
    });

    function timer() {
      if (
        router.currentRoute._value.path == "/game/waitingroom" &&
        dniCreator.value == dni.value
      ) {
        let timeLocal = localStorage.getItem("esperaSala");
        time.value = timeLocal
          ? parseInt(localStorage.getItem("esperaSala"))
          : 80;
        if (time.value != 0) {
          let timerValue = time.value - 1;
          localStorage.setItem("esperaSala", timerValue);
          setTimeout(timer, 1000);
        } else {
          buttonComenzar.value = false;
          localStorage.setItem("codigoSala", "");
          closeRoomTime();
        }
      }
    }

    async function closeRoomTime() {
      try {
        const players = await RoomRepository.getPlayers(codGame.value);

        for (let player in players) {
          await RoomRepository.updateUserRoomBy(
            codGame.value,
            player,
            "finish",
            true
          );
        }

        const responseIngreso = await RoomRepository.updateRoomBy(
          codGame.value,
          "ingreso",
          false
        );
        const responsePlaying = await RoomRepository.updateRoomBy(
          codGame.value,
          "playing",
          false
        );
        const responseClose = await RoomRepository.updateRoomBy(
          codGame.value,
          "close",
          true
        );

        if (
          responseIngreso.value == 400 ||
          responsePlaying.value == 400 ||
          responseClose == 400
        ) {
          backToSearchRoom();
        }
      } catch (error) {
        console.log(error);
        backToSearchRoom();
      }
    }

    function exitRoom() {
      if (closeRoom.value) {
        $q.notify({
          type: "negative",
          message: "Sala cerrada!",
          timeout: 1000,
        });
        backToSearchRoom();
      }
    }

    function copyCod() {
      let inputCodeCopy = inputCode.value;
      inputCodeCopy.disabled = false;
      inputCodeCopy.select();
      inputCodeCopy.setSelectionRange(0, 99999);
      document.execCommand("copy");
      inputCodeCopy.disabled = true;
    }

    async function players() {
      dniCreator.value = await RoomRepository.getRoomBy(
        salaCode.value,
        "creador"
      );

      if (dniCreator.value != 400) {
        buttonComenzar.value = dniCreator.value == dni.value;
        timer();
        const starCountRef = firebaseRef(rtdb, `${salaCode.value}`);
        const off = onValue(starCountRef, (snapshot) => {
          if (router.currentRoute._value.path == "/game/waitingroom") {
            const data = snapshot.val();
            let players = data.players;

            closeRoom.value = data.close;
            playing.value = data.playing;

            rows.value = [];
            for (let player in players) {
              rows.value.push({
                name: players[player].nombre,
                surname: players[player].apellido,
              });
            }
          } else {
            off();
          }
        });
      } else {
        $q.notify({
          type: "negative",
          message: "Ocurrió un error inesperado!",
          timeout: 1000,
        });
        router.push({ path: "/" });
      }
    }

    async function startGame() {
      localStorage.setItem("esperaFinal", 300);
      if (playing.value == true) {
        const players = await RoomRepository.getPlayers(salaCode.value);

        if (players != 400) {
          const totalPlayers = Object.keys(players).length;
          localStorage.setItem("totalPlayers", totalPlayers);
          router.push({ path: "/game/gamepreguntas" });
        } else {
          $q.notify({
            type: "negative",
            message: "Ocurrió un error inesperado!",
            timeout: 1000,
          });
          router.push({ path: "/" });
        }
      }
    }

    async function runGame() {
      const response = await RoomRepository.updateRoomBy(
        salaCode.value,
        "ingreso",
        false
      );
      if (response == 201) {
        const response2 = await RoomRepository.updateRoomBy(
          salaCode.value,
          "playing",
          true
        );
        if (response2 == 400) {
          $q.notify({
            type: "negative",
            message: "Ocurrió un error inesperado!",
            timeout: 1000,
          });
          router.push({ path: "/" });
        }
      } else {
        $q.notify({
          type: "negative",
          message: "Ocurrió un error inesperado!",
          timeout: 1000,
        });
        router.push({ path: "/" });
      }
    }

    async function backSearch() {
      rows.value = [];
      closeRoomTime();
    }

    function backToSearchRoom() {
      localStorage.setItem("puntos", 0);
      localStorage.setItem("erroneos", 0);
      localStorage.setItem("codigoSala", "");
      localStorage.setItem("ganador", "");
      localStorage.setItem("esperaFinal", 300);
      localStorage.setItem("puntosGanador", 0);
      localStorage.setItem("todosTerminan", false);
      localStorage.setItem("totalPlayers", 0);
      router.push({ path: "/game/searchroom" });
    }

    function toBackInit() {
      let name = localStorage.getItem("nombre");

      if (
        dni.value == undefined ||
        dni.value == "" ||
        name == undefined ||
        name == "" ||
        salaCode.value == undefined ||
        salaCode.value == ""
      ) {
        // let iframe = localStorage.getItem("iframe");
        // localStorage.clear();
        // if (iframe == "true") {
        //   router.push({ path: "/", query: { iframe: "true" } });
        // } else {
          router.push({ path: "/" });
        // }
      }
    }

    return {
      codGame,
      rows,
      columns,
      pagination: {
        rowsPerPage: 20,
      },
      inputCode,
      copyCod,
      buttonComenzar,
      runGame,
      time,
      backSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
.q-page {
  background: url("src/assets/img/fondo03.jpg") no-repeat center bottom/cover;
}

.form-field {
  text-align: center;
  display: block;
  width: 75%;
  height: 40px;
  padding: 8px 16px;
  line-height: 25px;
  font-size: 17px;
  font-weight: 600;
  font-family: inherit;
  border-radius: 6px 0 0 6px;
  border: 1px solid black !important;
  -webkit-appearance: none;
  color: var(--input-color);
  border: 1px solid var(--input-border);
  background: var(--input-background);
  transition: border 0.3s ease;
  &::placeholder {
    color: var(--input-placeholder);
  }
  &:focus {
    outline: none;
    border-color: var(--input-border-focus);
  }
}

.form-group {
  position: relative;
  height: 40px;
  display: flex;
  width: 85%;
  & > span,
  .form-field {
    width: 25%;
    border: 1px solid black !important;
    white-space: nowrap;
    display: block;
    &:not(:first-child):not(:last-child) {
      border-radius: 0;
    }
    &:first-child {
      border-radius: 6px 0 0 6px;
    }
    &:last-child {
      border-radius: 0 6px 6px 0;
    }
    &:not(:first-child) {
      margin-left: -1px;
    }
  }
  .form-field {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    width: 1%;
    margin-top: 0;
    margin-bottom: 0;
  }
  & > span {
    text-align: center;
    padding: 8px 12px;
    font-size: 14px;
    line-height: 25px;
    color: var(--group-color);
    background: var(--group-background);
    border: 1px solid var(--group-border);
    transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
  }
  &:focus-within {
    & > span {
      color: var(--group-color-focus);
      background: var(--group-background-focus);
      border-color: var(--group-border-focus);
    }
  }
}

body {
  min-height: 100vh;
  font-family: "Mukta Malar", Arial;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #f5f9ff;
  .form-group {
    max-width: 360px;
    &:not(:last-child) {
      margin-bottom: 32px;
    }
  }
}
</style>

<template>
  <div class="row text-center">
    <div class="col-12 q-mt-md" v-if="userInfo.order == 1 && !dataSetted">
      <span class="text-weight-bold"
        >Tiempo para que finalice la partida:
      </span>
      <q-btn
        rounded
        style="background-color: #003882; color: white"
        :dense="true"
        size="20px"
        ><span class="text-weight-bold">{{ finalTime }}</span></q-btn
      >
    </div>
    <div class="col-12 q-mt-md" v-if="!dataSetted">
      <span class="text-grey-7"
        >Espere que todos los participantes terminen la <br />
        partida para ver los resultados</span
      ><br />
      <q-img
        src="../../assets/img/gif-carga.gif"
        alt="Hola"
        style="width: 10%; margin-top: 5%"
        class="q-mb-md"
      />
    </div>
    <div class="col-12 q-mt-md" v-if="dataSetted">
      <div v-if="roomInfo.winner != userInfo.dni">
        <span class="text-h4 text-weight-bold">{{ userInfo.nombre }}</span
        ><br />
        <span class="text-weight-bold"
          >NO LOGRASTE SUMAR PUNTOS <br />
          EN ESTA PARTIDA</span
        >
      </div>
      <div v-if="roomInfo.winner == userInfo.dni">
        <span class="text-h4 text-weight-bold">{{ userInfo.nombre }}</span
        ><br />
        <span class="text-weight-bold"
          >LOGRASTE SUMAR {{ totalPoints }} PUNTOS <br />
          EN ESTA PARTIDA</span
        >
      </div>
    </div>

    <div class="col-6 q-mt-md">
      <q-card class="my-card corrects">
        <span class="text-weight-bold text-white" style="margin: auto"
          >ACERTADAS: {{ correctAnswers }}</span
        >
      </q-card>
    </div>
    <div class="col-6 q-mt-md">
      <q-card class="my-card wrongs">
        <span class="text-weight-bold text-white" style="margin: auto"
          >ERRONEAS: {{ 10 - correctAnswers }}</span
        >
      </q-card>
    </div>
    <div class="col-12">
      <q-card class="my-card tableCard">
        <q-card-section class="titleTable">
          <span class="text-weight-bold text-white">POSICIONES</span>
        </q-card-section>
        <q-table
          :rows="rows"
          :columns="columns"
          v-model:pagination="pagination"
          row-key="index"
          :rows-per-page-options="[0]"
          style="max-height: 215px; width: 90%; margin: 5px auto"
        />
      </q-card>
    </div>
    <div class="col-12" v-if="dataSetted">
      <q-btn
        @click="backToSearchRoom"
        class="q-mt-md"
        style="width: 50%; background-color: #003882; color: white"
        rounded
        :dense="true"
        size="25px"
        ><span class="text-weight-bold text-h6">VOLVER</span></q-btn
      >
    </div>
    <div class="col-12 q-mb-md" v-if="!dataSetted">
      <q-img
        src="../../assets/img/gif-carga.gif"
        alt="Hola"
        style="width: 10%; margin-top: 5%"
        class="q-mb-md"
      />
    </div>
    <div class="col-12">
      <q-img
        src="../../assets/img/logo.png"
        alt="Hola"
        style="width: 90%; margin-top: 5%"
        class="q-mb-md"
      />
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount, defineComponent, watch } from "vue";
import { useRouter } from "vue-router";
import { rtdb } from "../../boot/firebase";
import { ref as firebaseRef, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import UserRepository from "../../classes/repositories/user.repository";
import RoomRepository from "../../classes/repositories/room.repository";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MultiplayerFinal",
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const $q = useQuasar();
    const userSesion = ref(undefined);

    const gameOver = ref(false);
    const correctAnswers = ref(0);
    const totalPoints = ref(localStorage.getItem("puntosGanador"));
    const userInfo = ref({
      dni: localStorage.getItem("dni"),
      nombre: localStorage.getItem("nombre"),
      apellido: localStorage.getItem("apellido"),
      order: 0,
      points: 0,
      win: false,
    });
    const roomInfo = ref({
      salaCode: localStorage.getItem("codigoSala"),
      close: false,
      cargaPartidas: false,
      players: [],
      ingreso: false,
      playing: true,
      winner: "",
    });
    const dataRoom = ref(null);
    const finalTime = ref(null);
    const totalPlayers = ref(localStorage.getItem("totalPlayers"));
    const dataSetted = ref(false);

    const rows = ref([]);
    const columns = [
      {
        name: "index",
        label: "#",
        align: "center",
        field: "position",
        field: (row) => row.index,
      },
      {
        name: "name",
        required: true,
        label: "Nombre",
        align: "center",
        field: (row) => row.name,
      },
      {
        name: "points",
        required: true,
        label: "Puntos",
        align: "center",
        field: (row) => row.points,
      },
    ];

    onBeforeMount(() => {
      checkAuth();
      waitPlayers();
      init();
    });

    watch(userSesion, () => {
      toBackInit();
    });

    function checkAuth() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userSesion.value = true;
        } else {
          userSesion.value = false;
        }
      });
    }

    async function init() {
      const points = await UserRepository.getPointsRT(
        roomInfo.value.salaCode,
        userInfo.value.dni
      );

      correctAnswers.value = points;
      playersOrder();
    }

    async function playersOrder() {
      const dataPlayers = await RoomRepository.getPlayers(
        roomInfo.value.salaCode
      );

      if (dataPlayers != 400) {
        try {
          if (dataPlayers[userInfo.value.dni].order == 0) {
            const order = await UserRepository.changeOrder(
              dataPlayers,
              roomInfo.value.salaCode,
              userInfo.value.dni
            );
            userInfo.value.order = order;
          }
        } catch (error) {
          console.log(error);
          $q.notify({
            type: "negative",
            message: "Error al procesar los datos",
            timeout: 1000,
          });
          backToSearchRoom();
        }

        await UserRepository.finishPlayer(
          roomInfo.value.salaCode,
          userInfo.value.dni
        );

        verifyFinishRoom();
      } else {
        $q.notify({
          type: "negative",
          message: "Error al procesar los datos",
          timeout: 1000,
        });
        backToSearchRoom();
      }
    }

    async function verifyFinishRoom() {
      try {
        const roomRef = firebaseRef(rtdb, `${roomInfo.value.salaCode}/players`);
        let off = await onValue(roomRef, async (snapshot) => {
          let dataPlayers = snapshot.val();
          let arraySnapshot = Object.entries(dataPlayers);
  
          arraySnapshot.sort(
            (a, b) => b[1].points - a[1].points || a[1].order - b[1].order
          );
  
          rows.value = [];
          arraySnapshot.forEach((element, key) => {
            rows.value.push({
              index: key + 1,
              name: element[1]["nombre"],
              points: element[1]["points"],
            });
          });
  
          roomInfo.value.winner = arraySnapshot[0][0];
  
          if (roomInfo.value.winner == userInfo.value.dni) {
            await UserRepository.setWin(
              roomInfo.value.salaCode,
              userInfo.value.dni
            );
            userInfo.value.win = true;
          }
  
          let totalPlayersFinish = 0;
          for (let player in dataPlayers) {
            totalPlayersFinish += dataPlayers[player].finish ? 1 : 0;
            gameOver.value = totalPlayersFinish == totalPlayers.value;
          }
          if (gameOver.value) {
            off();
            setData();
          }
        });  
      } catch (error) {
        console.log(error);
      }
    }

    async function setData() {
      const response = await RoomRepository.setData(
        roomInfo.value.salaCode,
        roomInfo.value.winner
      );

      if (response != 400) {
        setDataDb();
      } else {
        backToSearchRoom();
      }
    }

    async function setDataDb() {
      try {
        dataRoom.value = await RoomRepository.roomData(roomInfo.value.salaCode);

        if (!dataRoom.value.cargaDatos) {
          await RoomRepository.updateRoomBy(
            roomInfo.value.salaCode,
            "cargaPartidas",
            true
          );
          await UserRepository.setTotalGamesDB(
            roomInfo.value.salaCode,
            dataRoom.value.players
          );
        }


        let roomClose = await RoomRepository.getRoomBy(roomInfo.value.salaCode, "close");
        if (userInfo.value.win && !roomClose) {
          await RoomRepository.updateRoomBy(
            roomInfo.value.salaCode,
            "close",
            true
          );
          totalPoints.value = await UserRepository.setPointsDB(
            dataRoom.value.players,
            userInfo.value.dni,
            totalPlayers.value
          );
        }
      } catch (error) {
        console.log(error);
      }
      dataSetted.value = true;
    }

    function waitPlayers() {
      if (
        router.currentRoute._value.path == "/game/finalpreguntas" &&
        !dataSetted.value
      ) {
        finalTime.value = parseInt(localStorage.getItem("esperaFinal"));
        if (finalTime.value != 0) {
          let timer = finalTime.value - 1;
          localStorage.setItem("esperaFinal", timer);
          setTimeout(waitPlayers, 1000);
        } else {
          closeRoom();
        }
      }
    }

    async function closeRoom() {
      try {
        const dataPlayers = await RoomRepository.getPlayers(
          roomInfo.value.salaCode
        );

        for (let player in dataPlayers) {
          await RoomRepository.updateUserRoomBy(
            roomInfo.value.salaCode,
            player,
            "finish",
            true
          );
        }
      } catch (error) {
        console.log(error);
      }
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
      if (
        userInfo.value.dni == undefined ||
        userInfo.value.dni == "" ||
        userInfo.value.nombre == undefined ||
        userInfo.value.nombre == "" ||
        roomInfo.value.salaCode == undefined ||
        roomInfo.value.salaCode == "" ||
        !userSesion.value
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
      columns,
      userInfo,
      roomInfo,
      rows,
      gameOver,
      correctAnswers,
      pagination: {
        rowsPerPage: 20,
      },
      totalPoints,
      finalTime,
      dataSetted,
      backToSearchRoom,
    };
  },
});
</script>

<style scoped>
.corrects {
  display: flex;
  align-items: center;
  width: 90%;
  height: 55px;
  background-color: green;
  float: right;
  border-radius: 0 !important;
}
.wrongs {
  display: flex;
  align-items: center;
  width: 90%;
  height: 55px;
  background-color: red;
  float: left;
  border-radius: 0 !important;
}
.tableCard {
  width: 90%;
  margin: 15px auto;
  border-radius: 10px 10px 0 0 !important;
}
.titleTable {
  background-color: #003882;
  border-radius: 10px 10px 0 0 !important;
}
</style>

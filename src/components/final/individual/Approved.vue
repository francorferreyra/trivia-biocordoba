<template>
  <div class="row">
    <div class="col-12 q-mt-md" v-if="!dataSetted">
      <q-img
        src="../../../assets/img/gif-carga.gif"
        alt="Hola"
        style="width: 10%; margin-top: 5%"
        class="q-mb-md"
      />
    </div>
    <div class="col-12" v-if="dataSetted && minTime == -1">
      <span class="text-h4 text-weight-bold">{{ user.name }}</span
      ><br />
      <span class="text-weight-bold"
        >LOGRASTE SUMAR {{ user.points }} PUNTOS <br />
        EN ESTA PARTIDA</span
      >
    </div>
    <div class="col-12" v-if="dataSetted && minTime == 1">
      <span class="text-h4 text-weight-bold">{{ user.name }}</span
      ><br />
      <span class="text-weight-bold"
        >NO LOGRASTE SUMAR PUNTOS ESTA PARTIDA YA QUE NO JUGASTE EL TIEMPO
        MÍNIMO NECESARIO PARA UN CORRECTO APRENDIZAJE</span
      >
    </div>
    <div class="col-6 q-mt-md">
      <q-card class="my-card corrects">
        <span class="text-weight-bold text-white" style="margin: auto"
          >ACERTADAS: {{ user.points }}</span
        >
      </q-card>
    </div>
    <div class="col-6 q-mt-md">
      <q-card class="my-card wrongs">
        <span class="text-weight-bold text-white" style="margin: auto"
          >ERRONEAS: {{ 10 - user.points }}</span
        >
      </q-card>
    </div>
    <div class="col-12" v-if="minTime == -1">
      <q-img
        src="../../../assets/img/isotipo.png"
        alt="Aprobado"
        style="width: 55%; margin-top: 10%"
        class="q-mb-md"
      />
    </div>
    <div class="col-12" v-if="minTime == 1">
      <q-img
        src="../../../assets/img/isotipo-negativo.png"
        alt="Aprobado"
        style="width: 55%; margin-top: 10%"
        class="q-mb-md"
      />
    </div>
    <div class="col-12 q-mb-md" v-if="!dataSetted">
      <q-img
        src="../../../assets/img/gif-carga.gif"
        alt="Hola"
        style="width: 10%; margin-top: 5%"
        class="q-mb-md"
      />
    </div>
    <div class="col-12" v-if="dataSetted">
      <q-btn
        class="q-mt-md"
        style="width: 50%; background-color: #003882; color: white"
        rounded
        @click="backToSearchRoom"
        :dense="true"
        size="25px"
        ><span class="text-weight-bold">VOLVER</span></q-btn
      >
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from "vue";
import UserRepository from "../../../classes/repositories/user.repository";
import RoomRepository from "../../../classes/repositories/room.repository";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "TransitaSeguro-Approved",
  props: ["points"],
  setup(props) {
    const router = useRouter();
    const room = ref({
      salaCode: ref(localStorage.getItem("codigoSala")),
    });
    const user = ref({
      dni: localStorage.getItem("dni"),
      name: localStorage.getItem("nombre"),
      points: props.points,
    });
    const minTime = localStorage.getItem("tiempoMinimo");
    const dataSetted = ref(false);

    onBeforeMount(() => {
      setGameDB();
    });

    async function setGameDB() {
      const response = await RoomRepository.setRoomDataIndividual(
        room.value.salaCode,
        user.value.dni,
        true
      );
      if (response == 200) {
        try {
          const dataRoom = await RoomRepository.getRoom(room.value.salaCode);
          console.log(dataRoom);
          if (!dataRoom.cargaPartidas) {
            await UserRepository.setTotalGamesDB(
              room.value.salaCode,
              dataRoom.players
            );
            if (minTime.value == 30) {
              await UserRepository.setPointsDBindividual(
                user.value.dni,
                user.value.points
              );
            }

            await RoomRepository.updateRoomBy(
              room.value.salaCode,
              "cargaPartidas",
              true
            );
          }
          dataSetted.value = true;
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("error");
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
      localStorage.setItem("tiempoMinimo", 1);
      router.push({ path: "/game/searchroom" });
    }

    return { user, dataSetted, backToSearchRoom, minTime };
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
</style>

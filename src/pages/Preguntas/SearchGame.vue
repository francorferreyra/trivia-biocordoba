<template>
  <q-page class="flex-top text-center">
    <div class="row">
      <div class="col-12">
        <q-img
          src="../../assets/img/logo.png"
          alt="Hola"
          style="width: 90%; margin-top: 5%"
          class="q-mb-md"
        />
      </div>
      <div class="col-12">
        <div style="width: 90%; margin: auto">
          <span class="text-weight-bold text-h5">Unirse a una Sala</span>
          <br />
          <span class="text-weight-bold text-h6 text-grey-14"
            >Código de la Sala</span
          >
          <q-input
            :input-style="{
              'font-size': '20px',
              'text-align': 'center',
              color: 'black',
            }"
            :dense="true"
            required
            v-model="salaCode"
            bg-color="white"
            outlined
          ></q-input>
        </div>
        <div class="q-pb-md" style="width: 40%; margin: auto">
          <q-btn
            @click="joinRoom"
            class="q-mt-md full-width"
            rounded
            style="background-color: #003882; color: white"
            :dense="true"
            size="23px"
            ><span class="text-weight-bold">UNIRSE</span></q-btn
          >
        </div>
        <div class="row">
          <div class="col-6" style="width: 48%; margin: auto">
            <q-btn
              class="q-mt-md full-width"
              rounded
              @click="newRoom(false)"
              style="background-color: #003882; color: white"
              :dense="true"
              size="18px"
              ><span
                class="text-weight-bold textGames textGames"
                style="font-size: 14px"
                >CREAR SALA</span
              ></q-btn
            >
          </div>
          <div class="col-6" style="width: 48%; margin: auto">
            <q-btn
              class="q-mt-md full-width"
              rounded
              @click="newRoom(true)"
              style="background-color: #003882; color: white"
              :dense="true"
              size="18px"
              ><span class="text-weight-bold textGames" style="font-size: 14px"
                >JUEGO INDIVIDUAL</span
              ></q-btn
            >
          </div>
        </div>
        <div style="width: 47%; margin: auto">
          <q-btn
            class="q-mt-md full-width"
            @click="back"
            rounded
            style="background-color: #003882; color: white"
            :dense="true"
            size="16px"
            ><span class="text-weight-bold textGames" style="font-size: 14px"
              >VOLVER AL INICIO</span
            ></q-btn
          >
        </div>
        <div class="btnBottom">
          <q-btn
            class="q-mt-md full-width"
            rounded
            @click="perfilData"
            style="background-color: #003882; color: white"
            :dense="true"
            size="16px"
            ><span class="text-weight-bold textGames" style="font-size: 14px"
              >MI PERFIL</span
            ></q-btn
          >
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import UserRepository from "../../classes/repositories/user.repository";
import RoomRepository from "../../classes/repositories/room.repository";

export default {
  name: "Search-Game",
  setup() {
    const salaCode = ref("");
    const router = useRouter();
    const $q = useQuasar();
    const userInfo = ref({
      salaCode: "",
      inRoom: false,
      nombre: localStorage.getItem("nombre"),
      apellido: localStorage.getItem("apellido"),
      dni: localStorage.getItem("dni"),
    });
    const roomInfo = ref({
      salaCode: "",
      creador: "",
      tipoJuego: localStorage.getItem("tipoJuego"),
    });

    const dataRoom = ref({});

    onBeforeMount(() => {
      localStorage.setItem("codigoSala", "");
      toBackInit();
    });

    async function newRoom(alone) {
      try {
        const response = await RoomRepository.newRoom(userInfo.value.dni);
        roomInfo.value.salaCode = localStorage.getItem("codigoSala");
        if (response[0] == 200) {
          if (response[1] == true) {
            newRoom();
          } else {
            setRoom(alone);
          }
        } else {
          $q.notify({
            type: "negative",
            message: "Error al crear la sala de juego",
            timeout: 2000,
          });
        }
      } catch (error) {
        console.log(error);
        $q.notify({
          type: "negative",
          message: "Error al crear la sala de juego",
          timeout: 2000,
        });
      }
    }

    async function setRoom(aloneGame) {
      try {
        roomInfo.value.creador = userInfo.value.dni;

        const responseCreateRoom = await RoomRepository.setRoom(
          roomInfo.value,
          userInfo.value
        );

        if (responseCreateRoom == 201) {
          roomInfo.value.salaCode = localStorage.getItem("codigoSala");

          if (aloneGame) {
            localStorage.setItem("totalPlayers", 1);
            const responseRunGame = await RoomRepository.runGame(
              roomInfo.value.salaCode
            );
            if (responseRunGame == 201) {
              router.push({
                path: "/game/gamepreguntas",
              });
            } else {
              $q.notify({
                type: "negative",
                message: "Error al iniciar el juego",
                timeout: 2000,
              });
            }
          } else {
            router.push({ path: "/game/waitingroom" });
          }
        } else {
          $q.notify({
            type: "negative",
            message: "Error al iniciar el juego",
            timeout: 2000,
          });
        }
      } catch (error) {
        console.log(error);
        $q.notify({
          type: "negative",
          message: "Error al iniciar el juego",
          timeout: 2000,
        });
      }
    }

    async function joinRoom() {
      if (salaCode.value != "") {
        try {
          roomInfo.value.salaCode = salaCode.value;
          dataRoom.value = await RoomRepository.roomData(
            roomInfo.value.salaCode
          );
          if (dataRoom.value) {
            userInfo.value.inRoom = await UserRepository.userInRoom(
              roomInfo.value.salaCode,
              userInfo.value.dni
            );
            checkAndSetPlayer();
          } else {
            $q.notify({
              type: "negative",
              message: "La sala ingresada no existe",
              timeout: 1000,
            });
          }
        } catch (error) {
          $q.notify({
            type: "negative",
            message: "Error al ingresar a la sala",
            timeout: 1000,
          });
        }
      } else {
        $q.notify({
          type: "negative",
          message: "Ingrese una sala",
          timeout: 1000,
        });
      }
    }

    async function checkAndSetPlayer() {
      if (!dataRoom.value.close) {
        if (!userInfo.value.inRoom) {
          if (dataRoom.value.ingreso) {
            const response = await RoomRepository.setPlayer(
              userInfo.value,
              roomInfo.value.salaCode
            );
            if (response == 201) {
              localStorage.setItem("codigoSala", roomInfo.value.salaCode);
              router.push({ path: "/game/waitingroom" });
            } else {
              $q.notify({
                type: "negative",
                message: "Error al unirse a la sala",
                timeout: 1000,
              });
            }
          } else {
            $q.notify({
              type: "negative",
              message: "Ingreso a la sala deshabilitado",
              timeout: 1000,
            });
          }
        } else if (userInfo.value.inRoom && dataRoom.value.playing) {
          localStorage.setItem("codigoSala", roomInfo.value.salaCode);
          $q.notify({
            type: "warning",
            message: "Sala en juego!",
            timeout: 1000,
          });
          router.push({ path: "/game/gamepreguntas" });
        } else if (userInfo.value.inRoom && dataRoom.value.ingreso) {
          localStorage.setItem("codigoSala", roomInfo.value.salaCode);
          router.push({ path: "/game/waitingroom" });
        } else if (userInfo.value.inRoom && !dataRoom.value.ingreso) {
          $q.notify({
            type: "negative",
            message: "Ingreso a la sala deshabilitado",
            timeout: 1000,
          });
        }
      } else {
        $q.notify({
          type: "negative",
          message: "Sala cerrada",
          timeout: 1000,
        });
      }
    }

    function toBackInit() {
      if (
        userInfo.value.dni == undefined ||
        userInfo.value.dni == "" ||
        userInfo.value.nombre == undefined ||
        userInfo.value.nombre == ""
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

    async function perfilData() {
      try {
        const perfilData = await UserRepository.getByDni(userInfo.value.dni);
        if (perfilData != 404) {
          $q.dialog({
            title: "<p class='text-center text-weight-bold' style='line-height: 0.5 !important; margin-bottom: 0 !important'>Perfil</p>",
            message: `<hr style='margin: 0px'><div class="text-center q-mt-md" style="line-height: 0.8"><p><span class='text-weight-bold'>DNI:</span> ${userInfo.value.dni}</p><br/><p><span class='text-weight-bold'>Nombre:</span> ${
              perfilData.nombre
            }</p><br/><p><span class='text-weight-bold'>Apellido:</span> ${
              perfilData.apellido
            }</p><br/><p><span class='text-weight-bold'>Localdiad:</span> ${
              perfilData.localidad
            }</p><br/><p><span class='text-weight-bold'>Provincia:</span> ${perfilData.provincia}</p><br/><p><span class='text-weight-bold'>Email:</span> ${
              perfilData.email
            }</p><br/><p><span class='text-weight-bold'>Partidas Jugadas: </span>${
              perfilData.partidasJugadas ? perfilData.partidasJugadas : 0
            }</p><br/><p><span class='text-weight-bold'>Puntos:</span> ${
              perfilData.puntos ? perfilData.puntos : 0
            }</p></div>`,
            html: true,
            cancel: true,
            ok: false,
            cancel: {
              label: "Cerrar",
              color: "indigo-10",
            },
            persistent: false,
          });
        } else {
          $q.notify({
            type: "negative",
            message: "Error al obtener datos de perfil",
            timeout: 2000,
          });
        }
      } catch (error) {
        console.log(error);
        $q.notify({
          type: "negative",
          message: "Error al obtener datos de perfil",
          timeout: 2000,
        });
      }
    }

    function back() {
      // let iframe = localStorage.getItem("iframe");
      // localStorage.clear();
      // localStorage.setItem("iframe", iframe);
      // if (iframe == "true") {
      //   router.push({ path: "/", query: { iframe: "true" } });
      // } else {
        router.push({ path: "/" });
      // }
    }

    return {
      dataRoom,
      newRoom,
      back,
      joinRoom,
      salaCode,
      perfilData,
    };
  },
};
</script>

<style scoped>
.q-page {
  background: url("src/assets/img/fondo02.jpg") no-repeat center top/cover;
}

@media only screen and (max-width: 345px) {
  .textGames {
    font-size: 13px !important;
  }
}

@media only screen and (max-width: 300px) {
  .textGames {
    font-size: 11px !important;
  }
}

.btnBottom {
  width: 45%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto 15px auto;
}
</style>

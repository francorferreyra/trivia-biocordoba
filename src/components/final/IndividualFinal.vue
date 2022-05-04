<template>
  <div class="row text-center">
    <div class="col-12">
      <q-img
        src="../../assets/img/logo.png"
        alt="Hola"
        style="width: 90%; margin-top: 5%"
        class="q-mb-md"
      />
    </div>
    <div class="col-12">
      <Approved :points="points" v-if="approved" />
      <Disapproved :points="points" v-if="!approved && approved != undefined" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import Approved from "./individual/Approved.vue";
import Disapproved from "./individual/Disapproved.vue";
import UserRepository from "../../classes/repositories/user.repository";

export default defineComponent({
  name: "IndividualFinal",
  components: {
    Approved,
    Disapproved,
  },
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const approved = ref(undefined);
    const salaCode = ref(localStorage.getItem("codigoSala"));
    const dni = ref(localStorage.getItem("dni"));
    const points = ref(0);

    onBeforeMount(async () => {
      try {
        points.value = await UserRepository.getPointsRT(
          salaCode.value,
          dni.value
        );
        approved.value = points.value > 6;
      } catch (error) {
        console.log(error);
        $q.notify({
          type: "negative",
          message: "Error al procesar los datos",
          timeout: 1000,
        });
        backToSearchRoom();
      }
    });

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

    return { approved, points };
  },
});
</script>

<style scoped></style>

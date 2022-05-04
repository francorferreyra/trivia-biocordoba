<template>
  <q-page class="flex-top">
    <IndividualFinal v-if="!multiplayer" />
    <MultiplayerFinal v-if="multiplayer"
  /></q-page>
</template>
<script>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

import IndividualFinal from "../../components/final/IndividualFinal.vue";
import MultiplayerFinal from "../../components/final/MultiplayerFinal.vue";

export default {
  name: "FinalPreguntas",
  components: {
    IndividualFinal,
    MultiplayerFinal,
  },
  setup() {
    const multiplayer = ref(parseInt(localStorage.getItem("totalPlayers")) > 1);
    const router = useRouter();
    onBeforeMount(async () => {
      toBackInit();
    });

    function toBackInit() {
      let dni = localStorage.getItem("dni");
      let name = localStorage.getItem("nombre");
      let codeSala = localStorage.getItem("codigoSala");

      if (
        dni == undefined ||
        dni == "" ||
        name == undefined ||
        name == "" ||
        codeSala == undefined ||
        codeSala == ""
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

    return { multiplayer };
  },
};
</script>

<style scoped>
.q-page {
  background: url("src/assets/img/fondo03.jpg") no-repeat center bottom/cover;
}
</style>

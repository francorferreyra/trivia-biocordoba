<template>
  <q-page class="q-page">
    <SorteoLogin v-if="!loginSucces" @loginChecked="changeLogin"/>
    <Sorteo v-else />
  </q-page>
</template>

<script>
import SorteoLogin from "../../components/sorteo/SorteoLogin.vue";
import Sorteo from "../../components/sorteo/Sorteo.vue";
import { ref, onBeforeMount } from "vue";

export default {
  name: "TransitaSeguro-SorteoIndex",
  components: {
    SorteoLogin,
    Sorteo,
  },

  setup() {
    const loginSucces = ref(true);

    function changeLogin() {
      loginSucces.value = true;
    }

    return {
      loginSucces, changeLogin
    };
  },
};
</script>

<style>
.q-page {
  background: url("src/assets/img/fondo03.jpg") no-repeat center bottom/cover;
}
</style>

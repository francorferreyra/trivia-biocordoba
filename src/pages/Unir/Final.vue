<template>
  <q-page class="flex flex-center">
    <div class="row text-center">
          <div class="col-12">
      <br />
      <span class="text-weight-bold text-h6">FELICIDADES!</span><br/>
      <span class="text-weight-bold"
        >ESPERO QUE HAYAS DISFRUTADO <br/> EL RECORRIDO PRESTANDO <br/> ATENCIÓN A LAS SEÑALES</span
      >
    </div>
      <div class="col-12 q-mt-md">
        <q-card class="my-card corrects">
          <span class="text-weight-bold text-white" style="margin: auto"
            >ACERTADAS: {{ points }}</span
          >
        </q-card>
      </div>
      <div class="col-12">
        <q-img
          src="../../assets/img/isotipo.png"
          alt="Aprobado"
          style="width: 55%; margin-top: 10%"
          class="q-mb-md"
        />
      </div>
      <div class="col-12">
        <q-btn
          @click="backIndex"
          class="q-mt-md"
          style="width: 50%; background-color: #003882; color: white"
          rounded
          :dense="true"
          size="25px"
          ><span class="text-weight-bold text-h6">VOLVER</span></q-btn
        >
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
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "Final-Unir",
  setup() {
    const points = ref(parseInt(localStorage.getItem("puntos")));
    const router = useRouter();

    function backIndex() {
      // let iframe = localStorage.getItem("iframe");
      // localStorage.clear();
      // if (iframe == "true") {
      //   router.push({ path: "/", query: { iframe: "true" }})
      // } else {
        router.push({ path: "/"})
      // }
    }

    return {
      points,
      backIndex,
    };
  },
};
</script>

<style scoped>
.q-page {
  background: url("src/assets/img/fondo03.jpg") no-repeat center bottom/cover;
}
.corrects {
  display: flex;
  margin: auto;
  align-items: center;
  width: 80%;
  height: 55px;
  background-color: green;
  border-radius: 0 !important;
}

</style>

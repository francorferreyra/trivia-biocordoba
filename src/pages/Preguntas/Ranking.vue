<template>
  <q-page class="q-page">
    <div class="row text-center">
      <div class="col-12">
        <q-img
          src="../../assets/img/logo.png"
          alt="Hola"
          style="width: 90%; margin-top: 5%"
        />
      </div>
      <div class="col-12 q-mt-md">
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
    </div>
  </q-page>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { query, orderBy, limit, getDocs, collection } from "firebase/firestore"; 
import { db } from "../../boot/firebase";

export default {
  name: "RankingPreguntas",

  setup() {
    const rows = ref([]);
    const columns = [
      {
        name: "name",
        required: true,
        label: "Nombre",
        align: "center",
        field: (row) => row.name,
      },
      {
        name: "state",
        required: true,
        label: "Provinica",
        align: "center",
        field: (row) => row.provincia,
      },
      {
        name: "city",
        required: true,
        label: "Ciudad",
        align: "center",
        field: (row) => row.localidad,
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
      rows.value = [];
      ranking();
    });

    async function ranking() {
      const q = query(collection(db, "users"), orderBy("puntos", "desc"), orderBy("partidasJugadas", "asc"), limit(10));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        rows.value.push({
          name: doc.data().nombre + " " +doc.data().apellido,
          provincia: doc.data().provincia,
          localidad: doc.data().localidad,
          points: doc.data().puntos,
        });
      });
    }

    return {
      rows,
      columns,
      pagination: {
        rowsPerPage: 30,
      },
    };
  },
};
</script>

<style>
.tableCard {
  width: 90%;
  margin: 15px auto;
  border-radius: 10px 10px 0 0 !important;
}
.titleTable {
  background-color: #003882;
  border-radius: 10px 10px 0 0 !important;
}

.q-page {
  background: url("src/assets/img/fondo03.jpg") no-repeat center bottom/cover;
}
</style>

<template>
  <div class="row text-center" style="width: 90%; margin: auto">
    <div class="col-12">
      <q-img
        src="../../assets/img/logo.png"
        alt="Hola"
        style="width: 90%; margin-top: 5%"
      />
    </div>
    <q-form @submit="sorteo" class="text-center" style="margin: auto">
      <div class="col-12 q-mt-md">
        <span class="text-weight-bold text-h6">Cantidad de ganadores</span>
        <q-input
          :input-style="{
            'font-size': '20px',
            'text-align': 'center',
            color: 'black',
          }"
          :dense="true"
          type="number"
          required
          v-model="totalWinners"
          bg-color="white"
          outlined
        />
      </div>
      <div class="col-12 q-mt-lg" style="width: 50%; margin: 20px auto 0 auto">
        <q-btn
          type="submit"
          rounded
          style="background-color: #003882; color: white"
          class="full-width"
          :dense="true"
          size="23px"
          ><span class="text-weight-bold">SORTEAR</span></q-btn
        >
      </div>
    </q-form>
    <div class="col-12 q-mt-md" v-if="sorteoSucces">
      <q-card class="my-card tableCard">
        <q-card-section class="titleTable">
          <span class="text-weight-bold text-white">GANADORES</span>
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
</template>

<script>
import { ref } from "vue";
import UserRepository from "../../classes/repositories/user.repository";
export default {
  name: "TransitaSeguro-Sorteo",

  setup(props, context) {
    const totalWinners = ref(null);
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
    ];
    const sorteoSucces = ref(false);

    async function sorteo() {
			sorteoSucces.value = false;
      let dbData = await UserRepository.getDataUserDbBy("config", "users");

			rows.value = [];
      for (let i = 0; i < totalWinners.value; i++) {
        let myRandomNumber;

        do {
          myRandomNumber = Math.floor(Math.random() * (dbData.total + 1));
        } while (myRandomNumber == 0);

        const ganador = await UserRepository.getOneDbBy(
          "randomId",
          myRandomNumber
        );

				const ganadorData = ganador[0][Object.keys(ganador[0])];

				if (ganador != 400) {
					if (!ganadorData.bloqueoSorteo) {
						rows.value.push({
							name: `${ganadorData.nombre} ${ganadorData.apellido}`,
							provincia: ganadorData.provincia,
							localidad: ganadorData.localidad,
						});
						let dniPlayer = Object.keys(ganador[0]);
						await UserRepository.bloqueoSorteo(dniPlayer.toString());
					} else {
						i--;
					}
				} else {
					i--;
				}
      }
			if (rows.value.length >= 1) {	
				sorteoSucces.value = true;
			}
    }

    return {
      totalWinners,
      rows,
      columns,
      pagination: {
        rowsPerPage: 30,
      },
      sorteoSucces,
      sorteo,
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
</style>

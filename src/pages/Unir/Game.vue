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
      <div class="col-12">
        <div class="row" style="width: 90%; margin: auto">
          <div
            class="col-4"
            style="word-break: break-word"
            v-for="pregunta in dataReorder"
            :key="pregunta.id"
          >
            <div class="text-weight-bold title-card q-pb-md q-mt-md">
              <span style="word-wrap: break-word">{{ pregunta.imagen }}</span>
            </div>
            <q-card class="my-card">
              <draggable
                ghost-class="hidden-ghost"
                class="drops"
                :list="lists[pregunta.id]"
                :group="pregunta.id"
                itemKey="dragDrop"
              >
                <template #item="{ element }">
                  <q-img
                    :ratio="1"
                    fit="contain"
                    width="90"
                    :src="
                      'https://www.estudiorochayasoc.com/vial/' + element['1']
                    "
                    alt="Señal"
                  />
                </template>
              </draggable>
            </q-card>
          </div>
        </div>
      </div>

      <div class="col-12 q-my-md">
        <q-icon size="xs" name="fas fa-arrow-up" />
        <span class="text-weight-bold q-mx-sm">UNIR CON</span>
        <q-icon size="xs" name="fas fa-arrow-down" />
      </div>
      <div class="col-12">
        <div class="row" style="width: 90%; margin: auto">
          <div class="col-4" v-for="pregunta in data" :key="pregunta.id">
            <draggable
            
              class="drags"
              :list="opcion[pregunta.id]"
              :group="pregunta.id"
              itemKey="dragDrop"
            >
              <template #item="{ element }">
                <q-card class="my-card">
                  <div>
                    <q-img
                      :ratio="1"
                      fit="contain"
                      width="90"
                      :src="
                        'https://www.estudiorochayasoc.com/vial/' + element['1']
                      "
                      alt="Señal"
                    />
                  </div>
                </q-card>
              </template>
            </draggable>
          </div>
        </div>
      </div>
      <div class="dataGame" style="width: 90%">
        <div class="row">
          <div class="col-4">
            <q-btn
              round
              style="background-color: #003882; color: white"
              size="14px"
              >{{ time }}</q-btn
            >
          </div>
          <div class="col-4">
            <q-btn
              round
              style="background-color: #003882; color: white"
              size="14px"
              >{{ points }}</q-btn
            >
          </div>
          <div class="col-4">
            <q-btn
              round
              style="background-color: #003882; color: white"
              size="14px"
              >{{ questionParam + 1 }}</q-btn
            >
          </div>
          <div class="col-4 text-weight-bolder">Tiempo</div>
          <div class="col-4 text-weight-bolder">Puntos</div>
          <div class="col-4 text-weight-bolder">Pregunta</div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { apiClientVial } from "../../boot/vial";
import { ref, onBeforeMount, watch } from "vue";
import draggable from "vuedraggable";
import { useRouter } from "vue-router";

export default {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  components: {
    draggable,
  },
  setup() {
    const data = ref(Array);
    const dataReorder = ref(Array);
    const opcion = ref([]);
    const lists = ref([]);
    const respuestas = ref({});
    const preguntas = ref({});
    const time = ref(60);
    const router = useRouter();
    const points = ref(0);
    const questionParam = ref(0);
    localStorage.setItem("puntos", 0);

    onBeforeMount(async () => {
      initGame();
    });

    watch(lists.value, () => {
      checkLists();
    });

    watch(questionParam, () => {
      initGame();
    });

    async function initGame() {
      await apiClientVial
        .get("unir-read.inc.php")
        .then((response) => {
          data.value = response.data;
          reOrder();
          setData();
          timer();
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function reOrder() {
      dataReorder.value = data.value.slice().sort((a, b) => {
        return a.id - b.id;
      });
    }

    function checkLists() {
      if (
        lists.value[data.value[0].id].length == 1 &&
        lists.value[data.value[1].id].length == 1 &&
        lists.value[data.value[2].id].length == 1
      ) {
        points.value++;
        localStorage.setItem("puntos", points.value);
        time.value = 60;
        questionParam.value++;
      }
    }

    function timer() {
      if (router.currentRoute._value.path == "/gameunir") {
        if (time.value != 0) {
          time.value--;
          setTimeout(timer, 1000);
        } else {
          alert("Se te agotó el tiempo");
          time.value = 60;
          router.push({ path: "/finalunir" });
        }
      }
    }

    async function setData() {
      data.value.forEach((element) => {
        opcion.value[element.id] = [element];
        lists.value[element.id] = [];
        respuestas.value[element.id] = opcion.value[element.id].id;
        preguntas.value[element.id] = opcion.value[element.id].id;
      });
    }

    return {
      respuestas,
      preguntas,
      data,
      lists,
      opcion,
      dataReorder,
      time,
      points,
      questionParam,
    };
  },

  methods: {
    replace: function () {
      this.list = [{ name: "Edgard" }];
    },
    clone: function (el) {
      return {
        name: el.name + " cloned",
      };
    },
  },
};
</script>

<style scoped>
.q-page {
  background: url("src/assets/img/fondo03.jpg") no-repeat center bottom/cover;
}

.dataGame {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  margin-bottom: 15px;
}

.my-card {
  margin: 0;
  border: 1px solid #003882;
  border-radius: 0px;
  height: 120px;
  width: auto;
}

.drops {
  height: 100px;
  width: auto;
}

.drags {
  height: 100px;
  width: auto;
}

.title-card {
  height: 70px;
  align-items: center;
  justify-content: center;
  display: flex;
}

.hidden-ghost {
  display: none;
}
</style>

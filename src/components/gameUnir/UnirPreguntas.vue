<template>
  <div class="row text-center">
    <h1>hola</h1>
    <div class="col-4" v-for="pregunta in data" :key="pregunta.id">
      <q-card class="my-card">
        <draggable
          class="drops"
          :list="list1"
          :group="pregunta.id"
          @change="log"
          itemKey="dragDrop"
        >
          <template #item="{ element }">
            <img
              width="90"
              :src="'https://www.estudiorochayasoc.com/vial/' + element['1']"
              alt="señal"
            />
          </template>
        </draggable>
      </q-card>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { ref, onBeforeMount } from "vue";

export default {
  name: "asdasd",
  props: ["preguntas"],
  components: {
    draggable,
  },

  setup(props) {
    const data = ref(props.preguntas);
    const list1 = ref([]);

    onBeforeMount(() => {
      console.log(data.value);
    });

    function log(evt) {
      console.log(evt);
      if (evt.added) {
        console.log(evt.added.element.id);
      }
    }

    return {
      data,
      list1,
      log,
    };
  },
};
</script>

<style scoped>
.q-page {
  background: url("src/assets/img/fondo03.jpg") no-repeat center bottom/cover;
}

.my-card {
  margin: 0 5px 0 5px;
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
</style>

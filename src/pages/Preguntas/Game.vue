<template>
  <q-page class="flex-top text-center">
    <div class="row justify-center">
      <div class="col-12">
        <q-img
          src="../../assets/img/logo.png"
          alt="Hola"
          style="width: 90%; margin-top: 5%"
          class="q-mb-md"
        />
      </div>
      <div class="col-12 text-left" style="width: 90%">
        <Questions
          @answerSelected="changeAnswer"
          v-if="questions != null"
          :questionProp="questions[questionParam]"
          class="q-mt-xl"
        />
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
              >{{ points }}/10</q-btn
            >
          </div>
          <div class="col-4">
            <q-btn
              round
              style="background-color: #003882; color: white"
              size="14px"
              >{{ questionParam + 1 }}/10</q-btn
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
import { ref, onBeforeMount } from "vue";
import Questions from "../../components/gamePreguntas/Questions.vue";
import { apiClientVial } from "../../boot/vial";
import { rtdb } from "../../boot/firebase";
import { ref as firebaseRef, update, onValue } from "firebase/database";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  name: "TransitaSeguro-GamePreguntas",
  components: {
    Questions,
  },
  setup() {
    const questions = ref([]);
    const questionParam = ref(0);
    const points = ref(0);
    const $q = useQuasar();
    const time = ref(35);
    const minTime = ref(30);
    const router = useRouter();
    const codeSala = ref(localStorage.getItem("codigoSala"));
    const dni = ref(localStorage.getItem("dni"));
    const name = ref(localStorage.getItem("nombre"));
    
    onBeforeMount(() => {
      localStorage.setItem("tiempoMinimo", 1);
      toBackInit();
      setInitPoints();
      getQuestions();
      startTimer();
      startMinTimer();
      verifyFinishPlayer();
    });

    async function verifyFinishPlayer() {
      const finishReef = firebaseRef(
        rtdb,
        `${codeSala.value}/players/${dni.value}/finish`
      );
      let off = await onValue(finishReef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          off();
          router.push({ path: "/game/finalpreguntas" });
        }
      });
    }

    async function setInitPoints() {
      localStorage.setItem("puntos", 0);
      localStorage.setItem("erroneos", 0);
      let dni = localStorage.getItem("dni");

      const updates = {};
      updates[`/${codeSala.value}/players/${dni}/points`] = points.value;

      await update(firebaseRef(rtdb), updates);
    }

    async function getQuestions() {
      questions.value = null;
      await apiClientVial
        .get("/preguntas-read-json.inc.php")
        .then((response) => {
          questions.value = response.data;
          questionParam.value = 0;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function startTimer() {
      if (router.currentRoute._value.path == "/game/gamepreguntas") {
        if (time.value != 0) {
          time.value--;
          setTimeout(startTimer, 1000);
        } else {
          changeAnswer();
          time.value = 35;
          startTimer();
        }
      }
    }

     function startMinTimer() {
      if (router.currentRoute._value.path == "/game/gamepreguntas") {
        if (minTime.value != 0) {
          minTime.value--;
          setTimeout(startTimer, 1000);
        } else {
          localStorage.setItem("tiempoMinimo", -1);
        }
      }
     }

    function changeAnswer(pPoints) {
      time.value = 35;
      points.value = pPoints;
      if (questionParam.value == 9) {
        router.push({ path: "/game/finalpreguntas" });
      } else {
        questionParam.value++;
      }
    }

    function toBackInit() {
      if (
        dni.value == undefined ||
        dni.value == "" ||
        name.value == undefined ||
        name.value == "" ||
        codeSala.value == undefined ||
        codeSala.value == ""
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

    return { questions, changeAnswer, questionParam, points, time };
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
</style>

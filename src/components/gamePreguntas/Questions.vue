<template>
  <!--eslint-disable vue/valid-v-for-->
  <div style="margin-top: 0">
    <div width="100" class="text-center q-mb-md">
      <q-img
        v-if="question.img_pregunta"
        :src="question.img_pregunta"
        class="imgPregunta"
      ></q-img>
    </div>
    <span class="text-weight-bold">{{ question.titulo_pregunta }}</span>
    <q-card
      @click="selectQuestion(questionData.correct)"
      v-for="questionData in question.preguntas"
      :class="{
        'my-card correctAnswer q-mt-md': selectAnswer && questionData.correct,
        'my-card wrongAnswer q-mt-md':
          selectAnswer && !questionData.correct && !selectCorrect,
        'my-card bg-blue-6 q-mt-md':
          !selectAnswer || (selectAnswer && selectCorrect && !questionData.correct),
      }"
    >
      <q-card-section class="text-white">
        {{ questionData.title }}
      </q-card-section>
    </q-card>
    <div style="margin-top: 150px"></div>
    <div v-if="selectAnswer" class="fullScreen"></div>
  </div>
</template>
<script>
import { rtdb } from "../../boot/firebase";
import { ref as firebaseRef, update } from "firebase/database";
import { defineComponent, ref, watchEffect } from "vue";

export default defineComponent({
  name: "TransitaSeguro-Questions",
  props: ["questionProp"],
  setup(props, context) {
    const question = ref({});
    const selectAnswer = ref(false);
    const selectCorrect = ref(false);
    const points = ref("");
    const wrongs = ref("");

    watchEffect(() => {
      props.questionProp, changeQuestion();
    });

    function changeQuestion() {
      question.value = props.questionProp;
      question.value["preguntas"] = [
        question.value.correcta == 1
          ? { correct: true, title: question.value[1] }
          : { correct: false, title: question.value[1] },
        question.value.correcta == 2
          ? { correct: true, title: question.value[2] }
          : { correct: false, title: question.value[2] },
        question.value.correcta == 3
          ? { correct: true, title: question.value[3] }
          : { correct: false, title: question.value[3] },
      ];
      question.value["preguntas"] = shuffle(question.value["preguntas"]);
    }

    function shuffle(sourceArray) {
      for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
      }
      return sourceArray;
    }

    function selectQuestion(correct) {
      selectAnswer.value = true;
      if (correct) {
        successAnswer();
        selectCorrect.value = true;
      } else {
        wrongs.value++;
        localStorage.setItem("erroneos", wrongs.value);
      }
      setTimeout(() => {
        selectCorrect.value = false;
        selectAnswer.value = false;
        context.emit("answerSelected", points.value);
      }, 1200);
    }

    async function successAnswer() {
      let salaCode = localStorage.getItem("codigoSala");
      let dni = localStorage.getItem("dni");

      points.value++;
      localStorage.setItem("puntos", points.value);

      const updates = {};
      updates[`/${salaCode}/players/${dni}/points`] = points.value;

      await update(firebaseRef(rtdb), updates);
    }

    return { question, selectQuestion, selectAnswer, selectCorrect };
  },
});
</script>

<style scoped>
.correctAnswer {
  background-color: #5cb85c;
}
.wrongAnswer {
  background-color: #d9534f;
}
.fullScreen {
  width: 100%;
  height: 100%;
  z-index: 99;
  opacity: 0.05;
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
}
.imgPregunta {
  width: 80%;
  height: auto;
  margin: auto;
}
</style>

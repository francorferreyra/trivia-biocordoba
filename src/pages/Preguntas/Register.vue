<template>
  <q-page class="flex-top text-center">
    <div class="row">
      <div class="col-12">
        <q-img
          src="../../assets/img/logo.png"
          alt="Hola"
          style="width: 90%; margin-top: 5%"
          class="q-mb-md"
        />
      </div>
      <div class="col-12">
        <span class="text-weight-bold text-h5 text-grey-14"
          >Formulario de Registro</span
        >
      </div>
      <div class="col-12">
        <q-form style="width: 90%; margin: auto" @submit="submitForm">
          <div class="row">
            <div class="q-mt-md q-px-xs col-6">
              <span class="text-weight-bold">Nombre</span>
              <q-input
                :input-style="{
                  'font-size': '20px',
                  'text-align': 'center',
                  color: 'black',
                }"
                type="text"
                :dense="true"
                required
                v-model="user.name"
                bg-color="white"
                outlined
              ></q-input>
            </div>
            <div class="q-mt-md q-px-xs col-6">
              <span class="text-weight-bold">Apellido</span>
              <q-input
                :input-style="{
                  'font-size': '20px',
                  'text-align': 'center',
                  color: 'black',
                }"
                type="text"
                :dense="true"
                required
                v-model="user.surname"
                bg-color="white"
                outlined
              ></q-input>
            </div>
            <div class="q-mt-md col-12">
              <span class="text-weight-bold">Email</span>
              <q-input
                :input-style="{
                  'font-size': '20px',
                  'text-align': 'center',
                  color: 'black',
                }"
                type="email"
                :dense="true"
                required
                v-model="user.email"
                bg-color="white"
                outlined
              ></q-input>
            </div>
            <div class="q-mt-md col-12">
              <span class="text-weight-bold">N° de Documento</span>
              <q-input
                :input-style="{
                  'font-size': '20px',
                  'text-align': 'center',
                  color: 'black',
                }"
                :dense="true"
                required
                mask="########"
                v-model="user.dni"
                bg-color="white"
                outlined
              ></q-input>
            </div>
            <div class="q-mt-md col-12">
              <span class="text-weight-bold">N° de Teléfono Celular</span>
              <q-input
                :input-style="{
                  'font-size': '20px',
                  'text-align': 'center',
                  color: 'black',
                }"
                type="text"
                :dense="true"
                required
                v-model="user.cel"
                bg-color="white"
                mask="##########"
                hint="11 1234-5678 / 1234-567891"
                outlined
              ></q-input>
            </div>
            <div class="q-mt-md q-mb-lg q-px-xs col-6">
              <span class="text-weight-bold">Provincia</span>
              <q-select
                :dense="true"
                use-input
                input-debounce="0"
                @filter="filterFnProvincias"
                v-model="provincia"
                bg-color="white"
                outlined
                :options="provincias"
              ></q-select>
            </div>
            <div class="q-mt-md q-mb-md q-px-xs col-6">
              <span class="text-weight-bold">Localidad</span>
              <q-select
                :dense="true"
                use-input
                input-debounce="0"
                @filter="filterFnLocalidades"
                v-model="localidad"
                bg-color="white"
                outlined
                :options="localidades"
              ></q-select>
            </div>
            <div class="col-12 text-center text-weight-bold">Fecha Nacimiento</div>
            <div class="col-4 q-mt-sm q-px-xs">
              <q-select
              hint="Mes"
                :dense="true"
                required
                v-model="month"
                bg-color="white"
                outlined
                :options="months"
              ></q-select>
            </div>
            <div class="col-4 q-mt-sm q-px-xs">
              <q-select
              hint="Día"
                :dense="true"
                required
                v-model="day"
                bg-color="white"
                outlined
                :options="days"
              ></q-select>
            </div>
            <div class="col-4 q-mt-sm q-px-xs">
              <q-select
              hint="Año"
                :dense="true"
                required
                v-model="year"
                bg-color="white"
                outlined
                :options="years"
              ></q-select>
            </div>
          </div>

          <div class="q-mt-md">
            <span class="text-weight-bold">Contraseña</span>
            <q-input
              :input-style="{
                'font-size': '20px',
                'text-align': 'center',
                color: 'black',
              }"
              :dense="true"
              @keypress.enter="submitForm"
              required
              :type="isPwd ? 'password' : 'text'"
              v-model="user.password"
              bg-color="white"
              outlined
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                /> </template
            ></q-input>
          </div>
          <div style="width: 90%; margin: 25px auto 0 auto">
            <span class="text-grey-14"
              >Al registrarte estás aceptando los <br />
              <a
                style="color: #003882"
                href="https://transitaseguro.com.ar/c/recursos/terminos-y-condiciones/33c847fb0f"
                target="_blank"
                >Términos y Condiciones</a
              ></span
            >
          </div>
          <div style="width: 65%; margin: auto" v-if="!loading">
            <q-btn
              type="submit"
              class="q-mt-md full-width"
              rounded
              style="background-color: #003882; color: white"
              :dense="true"
              size="25px"
              ><span class="text-weight-bold">REGÍSTRATE</span></q-btn
            >
          </div>
          <div style="width: 65%; margin: auto" v-if="loading">
            <q-card
              class="my-card"
              style="
                background-color: #003882;
                color: white;
                border-radius: 25px;
                width: 100%;
                word-wrap: break-word;
              "
            >
              <q-img
                src="../../assets/img/gif-carga.gif"
                alt="Hola"
                style="width: 25px; margin-top: 6%"
                class="q-mb-md"
              />
            </q-card>
          </div>
        </q-form>
        <router-link to="/"
          ><span style="color: #003882; font-size: 25px"
            >Volver</span
          ></router-link
        >
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { getAuth, deleteUser, signOut } from "firebase/auth";
import PublicFunction from "../../classes/PublicFunction";
import UserRepository from "../../classes/repositories/user.repository";

export default {
  name: "Sign-Up",
  setup() {
    const loading = ref(false);
    const user = ref({
      dni: "",
      name: "",
      surname: "",
      cel: "",
      email: "",
      password: "",
    });

    const provincia = ref("");
    const localidad = ref("");
    const day = ref("");
    const month = ref("");
    const year = ref("");
    //--Options--
    const months = [
      {
        label: "Enero",
        value: 1,
      },
      {
        label: "Febrero",
        value: 2,
      },
      {
        label: "Marzo",
        value: 3,
      },
      {
        label: "Abril",
        value: 4,
      },
      {
        label: "Mayo",
        value: 5,
      },
      {
        label: "Junio",
        value: 6,
      },
      {
        label: "Julio",
        value: 7,
      },
      {
        label: "Agosto",
        value: 8,
      },
      {
        label: "Septiembre",
        value: 9,
      },
      {
        label: "Octubre",
        value: 10,
      },
      {
        label: "Noviembre",
        value: 11,
      },
      {
        label: "Diciembre",
        value: 12,
      },
    ];
    const years = ref([]);
    const days = ref([]);
    const provincias = ref([]);
    const provinciasOptions = ref([]);
    const localidades = ref([]);
    const localidadesOptions = ref([]);
    //----
    const auth = getAuth();
    const isPwd = ref(true);
    const router = useRouter();
    const $q = useQuasar();

    onBeforeMount(async () => {
      signOut(auth);
      let gameMode = localStorage.getItem("tipoJuego");
      if (gameMode != "trivia") {
        // let iframe = localStorage.getItem("iframe");
        // if (iframe) {
        //   router.push({ path: "/", query: { iframe: "true" } });
        // } else {
          router.push({ path: "/" });
        // }
      } else {
        years.value = await getYears();
        provincias.value = await PublicFunction.getProvincias();
        provinciasOptions.value = provincias.value;
        if (provincias.value == 400) {
          $q.notify({
            type: "error",
            message: "Error al listar las provincias",
            timeout: 2000,
          });
          router.push({ path: "/login" });
        }
      }
    });

    watch(month, async () => {
      days.value = await PublicFunction.getDays(month.value);
    });

    watch(provincia, async () => {
      localidades.value = await PublicFunction.getLocalidades(provincia.value);
      localidadesOptions.value = localidades.value;
      if (localidades.value == 400) {
        $q.notify({
          type: "error",
          message: "Error al listar las localidades",
          timeout: 2000,
        });
        router.push({ path: "/login" });
      }
    });

    async function submitForm() {
      loading.value = true;
      if (
        user.value.dni == "" ||
        user.value.name == "" ||
        user.value.surname == "" ||
        user.value.cel == "" ||
        user.value.email == "" ||
        user.value.password == "" ||
        provincia.value == "" ||
        localidad.value == ""
      ) {
        loading.value = false;
        $q.notify({
          type: "warning",
          message: "Complete los datos del formulario",
          timeout: 2000,
        });
      } else {
        const docExists = await UserRepository.existsDb(user.value.dni);

        if (docExists) {
          loading.value = false;
          $q.notify({
            type: "negative",
            message: "El documento ingresado ya se encuentra registrado",
            timeout: 2000,
          });
        } else {
          setAuthEmai();
        }
      }
    }

    async function setAuthEmai() {
      const userCreate = await UserRepository.createUserEmail(
        auth,
        user.value.email,
        user.value.password
      );
      if (userCreate[0] == 201) {
        setUser(userCreate[1]);
      } else if (
        userCreate[0] == 400 &&
        userCreate[1] == "email-already-in-use"
      ) {
        loading.value = false;

        $q.notify({
          type: "negative",
          message: "El email ingresado ya se encuentra registrado",
          timeout: 2000,
        });
      } else if (userCreate[0] == 400 && userCreate[1] == "invalid-email") {
        loading.value = false;
        $q.notify({
          type: "negative",
          message: "Email inválido",
          timeout: 2000,
        });
      } else {
        loading.value = false;
        $q.notify({
          type: "negative",
          message: "Error al procesar el email",
          timeout: 2000,
        });
      }
    }

    async function setUser(uid) {
      let birthDay = year.value + "-" + month.value.value + "-" + day.value;

      const dataUser = {
        nombre: user.value.name,
        apellido: user.value.surname,
        email: user.value.email,
        nacimiento: birthDay,
        telefono: user.value.cel,
        bloquear: false,
        uid: uid,
        provincia: provincia.value,
        localidad: localidad.value,
        randomId: null,
      };

      const saveUser = await UserRepository.saveDb(user.value.dni, dataUser);

      if (saveUser !== 400) {
        router.push({ path: "/game/searchroom" });
      } else {
        loading.value = false;
        let user = auth.currentUser;
        deleteUser(user);
        $q.notify({
          type: "negative",
          message: "Error al registrar el usuario",
          timeout: 2000,
        });
      }
    }

    function getYears() {
      let years = [];
      for (let i = 0; i < 81; i++) {
        years.push(i + 1940);
      }
      return years;
    }

    function filterFnProvincias(val, update) {
      if (val === "") {
        update(() => {
          provincias.value = provinciasOptions.value;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        provincias.value = provinciasOptions.value.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    }

    function filterFnLocalidades(val, update) {
      if (val === "") {
        update(() => {
          localidades.value = localidadesOptions.value;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        localidades.value = localidadesOptions.value.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    }

    return {
      months,
      submitForm,
      years,
      days,
      isPwd,
      month,
      day,
      year,
      localidades,
      provincias,
      filterFnProvincias,
      filterFnLocalidades,
      user,
      provincia,
      localidad,
      loading,
    };
  },
};
</script>

<style scoped>
.q-page {
  background: url("src/assets/img/fondo03.jpg") no-repeat center bottom/cover;
}
</style>

<template>
  <router-view />
</template>

<script>
import { ref, onBeforeMount, watch } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref as firebaseRef, onValue } from "firebase/database";
import { rtdb } from "../boot/firebase";

export default {
  name: "AuthSession",

  setup() {
    const auth = getAuth();
    const userSesion = ref(undefined);
    const router = useRouter();
    const userActiveToken = ref(null);
    const userUid = ref(null);

    onBeforeMount(async () => {
      await onAuthStateChanged(auth, (user) => {
        if (user) {
          userActiveToken.value = user.stsTokenManager.accessToken;
          userUid.value = user.uid;
          userSesion.value = true;
          checkOneDeviceUser();
        } else {
          userSesion.value = false;
          checkOneDeviceUser();
        }
      });
    });

    watch(userSesion, () => {
      if (!userSesion.value) {
        router.push({ path: "/" });
      }
    });

    async function checkOneDeviceUser() {
      const loginTokensRef = firebaseRef(rtdb, `logins/${userUid.value}`);
      onValue(loginTokensRef, (snapshot) => {
        if (userActiveToken.value != snapshot.val()) {
          router.push({ path: "/" });
        }
      });
    }
  },
};
</script>

<style></style>

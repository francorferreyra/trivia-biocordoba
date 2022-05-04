import {
  setDoc,
  limit,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, rtdb } from "../../boot/firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  Auth,
} from "firebase/auth";
import PublicFunction from "../PublicFunction";
import { ref as firebaseRef, child, get, update } from "firebase/database";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
class UserRepository {
  async getAll() {
    const docRef = collection(db, "users");
    const querySnapshot = await getDocs(docRef);
    return querySnapshot;
  }

  async getByDni(dni: string) {
    const docRef = doc(db, "users", dni);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return 404;
    }
  }

  async getDataUserDbBy(collection: string, dni: string): Promise<any> {
    const docRef = doc(db, `${collection}`, `${dni}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return 400;
    }
  }

  async getOneDbBy(filter: string, data: number | string | boolean) {
    const q = query(
      collection(db, "users"),
      where(`${filter}`, "==", data),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    const docs: Object[] = [];
    querySnapshot.forEach((doc) => {
      docs.push({ [doc.id]: doc.data() });
    });

    if (docs.length === 1) {
      return docs;
    } else {
      return 400;
    }
  }

  //Correct
  async createUserEmail(auth: Auth, email: string, password: string) {
    const userCreated = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
      .then((userCredential) => {
        return [201, userCredential.user.uid];
      })
      .catch((error) => {
        if (error.code == "auth/email-already-in-use") {
          return [400, "email-already-in-use"];
        } else if ((error.code = "auth/invalid-email")) {
          return [400, "invalid-email"];
        } else {
          return [400, "generic-error"];
        }
      });
    return userCreated;
  }

  //Correct
  async saveDb(dni: string, dataUser: any): Promise<number> {
    try {
      let namePascal = await PublicFunction.pascalCase(dataUser.nombre);
      let surnamePascal = await PublicFunction.pascalCase(dataUser.apellido);
      let emailLower = dataUser.email.toLowerCase();
      let randomId = await this.randomUser(dataUser.randomId);
      if (randomId !== 400) {
        const user = {
          nombre: namePascal,
          apellido: surnamePascal,
          email: emailLower,
          nacimiento: dataUser.nacimiento,
          telefono: dataUser.telefono,
          bloquear: dataUser.bloquear,
          uid: dataUser.uid,
          provincia: dataUser.provincia,
          localidad: dataUser.localidad,
          randomId: randomId,
        };

        const saveResponse = setDoc(doc(db, "users", dni), user)
          .then(() => {
            localStorage.setItem("nombre", user.nombre);
            localStorage.setItem("apellido", user.apellido);
            localStorage.setItem("dni", dni);
            localStorage.setItem("nivel", "0");
            localStorage.setItem("bloquear", "false");
            localStorage.setItem("puntosGanador", "0");
            localStorage.setItem("todosTerminan", "false");
            localStorage.setItem("totalPlayers", "0");
            return 201;
          })
          .catch((error) => {
            console.log(error);
            return 400;
          });
        return saveResponse;
      } else {
        return 400;
      }
    } catch (error) {
      console.log(error);
      return 400;
    }
  }

  async getPointsRT(roomCode: string, dni: string) {
    const roomRef = firebaseRef(rtdb);

    const points = await get(
      child(roomRef, `${roomCode}/players/${dni}/points`)
    ).then((snapshot) => {
      return snapshot.val();
    });
    return points;
  }

  async existsDb(dni: string) {
    const docRef = doc(db, "users", dni);
    const docSnap = await getDoc(docRef);
    const exists = docSnap.exists();
    return exists;
  }

  async setDeviceToken(dni: string): Promise<any> {

    //Registro al usuario a las notificaciones. Esto con hacerlo una vez que se registra ya no haría
    //más falta, ya que se queda en memoria del celular, lo realizo nuevamente en el login
    //por si alguien desinstala la app y la vuelve a intalar o borra archivos de la app, etc.
    await PushNotifications.register();

    //Establezo un objeto de escucha del registro, la cual ejecuta una función al 
    //detectar que un usuario fué registrado. Guardo el token que se le asignó al dispositivo
    //en los datos del usuario en la base de datos.
    const token = await PushNotifications.addListener("registration", (token: Token) => {
      let objToken: any = {};
      objToken["tokens"] = token.value;
      setDoc(doc(db, "users", dni), objToken, { merge: true });
      return token.value;
    });
    return token;
  }

  async signIn(auth: Auth, email: string, password: string): Promise<any> {
    const signSuccess = await setPersistence(auth, browserSessionPersistence)
      .then(async () => {
        return await signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            const dbRef = firebaseRef(rtdb);
            const userCred: any = userCredential.user;

            let updateLoginToken: any = {};
            updateLoginToken[`logins/${userCredential.user.uid}`] =
              userCred.stsTokenManager.accessToken;

            await update(dbRef, updateLoginToken);

            return [200, userCred.uid];
          })
          .catch((error) => {
            if (error.code == "auth/wrong-password") {
              return [400, "wrong-password"];
            } else if (error.code == "auth/user-not-found") {
              return [400, "user-not-found"];
            } else {
              return [400, "generic-error"];
            }
          });
      })
      .catch((error) => {
        console.log(error);
        return [400, "generic-error"];
      });

    return signSuccess;
  }

  async changeOrder(
    players: any,
    roomCode: string,
    dni: string
  ): Promise<number> {
    const dbRef = firebaseRef(rtdb);
    let playersOrders: number[] = [];
    let i = 0;
    for (let player in players) {
      let order = players[player].order;
      playersOrders[i] = order;
      i++;
    }
    let actualOrder = Math.max.apply(null, playersOrders);
    const orderUser = actualOrder + 1;
    let updateOrder: any = {};
    updateOrder[`${roomCode}/players/${dni}/order`] = orderUser;

    await update(dbRef, updateOrder);
    return orderUser;
  }

  async randomUser(birthDay: string): Promise<number> {
    try {
      const yearsOld: number = PublicFunction.calcularEdad(birthDay);
      const configRef = doc(db, "config", "users");

      await updateDoc(configRef, {
        total: increment(1),
      });

      if (yearsOld < 18) {
        await updateDoc(configRef, {
          menores: increment(1),
        });
      } else {
        await updateDoc(configRef, {
          mayores: increment(1),
        });
      }

      const docSnap = await getDoc(configRef);
      const dataPlayers = docSnap.data() ? docSnap.data() : undefined;
      if (dataPlayers) {
        var totalPlayers = dataPlayers.total ? dataPlayers.total : undefined;
      }

      return totalPlayers;
    } catch (error) {
      console.log(error);
      return 400;
    }
  }

  async setTotalGamesDB(roomCode: string, players: any) {
    for (let player in players) {
      let objGames: any = {};
      objGames["partidas"] = {};
      objGames["partidas"][roomCode] = players[player].win;
      await setDoc(doc(db, "users", player), objGames, { merge: true });

      const docRef = doc(db, "users", player);
      const gamesUser: any = await getDoc(docRef);

      const totalGames = Object.values(gamesUser.data().partidas).length;

      await updateDoc(doc(db, "users", player), {
        partidasJugadas: totalGames,
      });
    }
  }

  async bloqueoSorteo(player: string): Promise<void> {
    await setDoc(
      doc(db, "users", player),
      { bloqueoSorteo: true },
      { merge: true }
    );
  }

  async setWin(roomCode: string, dni: string): Promise<void> {
    try {
      const dbRef = firebaseRef(rtdb);

      let setWin: any = {};
      setWin[`${roomCode}/players/${dni}/win`] = true;
      update(dbRef, setWin);
    } catch (error) {
      console.log(error);
    }
  }

  async setPointsDB(players: any, dni: string, totalPlayers: string) {
    const totalPoints: number = parseInt(
      players[dni].points + parseInt(totalPlayers) * 2
    );
    localStorage.setItem("puntosGanador", totalPoints.toString());
    await updateDoc(doc(db, "users", dni), {
      puntos: increment(totalPoints),
    });
    return totalPoints;
  }

  async setPointsDBindividual(dni: string, points: number) {
    await updateDoc(doc(db, "users", dni), {
      puntos: increment(points),
    });
  }

  async finishPlayer(roomCode: string, dni: string): Promise<void> {
    const dbRef = firebaseRef(rtdb);

    const updateFinishRoom: any = {};
    updateFinishRoom[`${roomCode}/players/${dni}/finish`] = true;

    await update(dbRef, updateFinishRoom);
  }

  async userInRoom(roomCode: string, dni: string): Promise<boolean> {
    const roomRef = firebaseRef(rtdb);

    const userExists = await get(child(roomRef, `${roomCode}/players/${dni}`))
      .then((snapshot) => {
        return snapshot.exists();
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    return userExists;
  }
}

export default new UserRepository();

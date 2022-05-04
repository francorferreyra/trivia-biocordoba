import { rtdb } from "../../boot/firebase";
import { set, ref as firebaseRef, child, get, update } from "firebase/database";

class RoomRepository {

  //Correct
  async newRoom(dni: string): Promise<any[]> {
    localStorage.setItem("esperaSala", "120");

    let codeSala = await this.randCode();
    localStorage.setItem("codigoSala", codeSala);

    let verificarSala = false;

    const dbRef = firebaseRef(rtdb);
    const responses = await get(child(dbRef, `${codeSala}`))
      .then((snapshot) => {
        verificarSala = snapshot.exists();
        return 200;
      })
      .catch((error) => {
        console.error(error);
        return 400;
      });

    return [responses, verificarSala];
  }

  //Correct
  async setRoom(room: any, user: any): Promise<number> {
    try {
      localStorage.setItem("puntos", "0");
      localStorage.setItem("erroneos", "0");

      let roomData: any = {};
      roomData["creador"] = room.creador;
      roomData["ingreso"] = true;
      roomData["tipoJuego"] = room.tipoJuego;
      roomData["close"] = false;
      roomData["cargaPartidas"] = false;
      roomData["players"] = {};
      roomData["players"][room.creador] = {};
      roomData["players"][room.creador]["nombre"] = user.nombre;
      roomData["players"][room.creador]["apellido"] = user.apellido;
      roomData["players"][room.creador]["points"] = 0;
      roomData["players"][room.creador]["win"] = false;
      roomData["players"][room.creador]["finish"] = false;
      roomData["players"][room.creador]["order"] = 0;
      roomData["playing"] = false;
      roomData["winner"] = "";

      await set(firebaseRef(rtdb, `${room.salaCode}`), roomData);
      return 201;
    } catch (error) {
      console.log(error);
      return 400;
    }
  }

  //Correct
  async setPlayer(user: any, roomCode: string): Promise<number> {
    try {
      let obj: any = {};
      obj[user.dni] = {};
      obj[user.dni]["nombre"] = user.nombre;
      obj[user.dni]["apellido"] = user.apellido;
      obj[user.dni]["points"] = 0;
      obj[user.dni]["win"] = false;
      obj[user.dni]["finish"] = false;
      obj[user.dni]["order"] = 0;

      const refPlayers = firebaseRef(rtdb, `${roomCode}/players`);

      await update(refPlayers, obj);
      return 201;
    } catch (error) {
      return 400;
    }
  }

  async updateRoomBy(roomCode: string, filter: string, data: string | number | boolean) : Promise<number> {
    try {
      let refFilter: string;
      switch (filter) {
        case "close":
          refFilter = `${roomCode}/close`;
          break;
        case "ingreso":
          refFilter = `${roomCode}/ingreso`;
          break;
        case "cargaPartidas":
          refFilter = `${roomCode}/cargaPartidas`;
          break;
        case "players":
          refFilter = `${roomCode}/players`;
          break;
        case "playing":
          refFilter = `${roomCode}/playing`;
          break;
        case "tipoJuego":
          refFilter = `${roomCode}/tipoJuego`;
          break;
        case "winner":
          refFilter = `${roomCode}/winner`;
          break;
        default:
          refFilter = "not-found";
          break;
      }

      if (refFilter != "not-found") {
        let obj: any = {};
        obj[`${refFilter}`] = data;
  
        const refRoom = firebaseRef(rtdb);
        await update(refRoom, obj);
        return 201;
      } else {
        return 400
      }
    } catch (error) {
      console.log(error);
      return 400;
    }
  }

  async updateUserRoomBy(roomCode: string, player: string, filter: string, data: string | number | boolean){
    try {
      let refFilter: string;
      switch (filter) {
        case "finish":
          refFilter = `${roomCode}/players/${player}/finish`;
          break;
        case "points":
          refFilter = `${roomCode}/players/${player}/points`;
          break;
        case "win":
          refFilter = `${roomCode}/players/${player}/win`;
          break;
        case "order":
          refFilter = `${roomCode}/players/${player}/order`;
          break;
        default:
          refFilter = "not-found";
          break;
      }

      if (refFilter != "not-found") {
        let obj: any = {};
        obj[`${refFilter}`] = data;
  
        const refRoom = firebaseRef(rtdb);
        await update(refRoom, obj);
        return 201;
      } else {
        return 400
      }
    } catch (error) {
      return 400;
    }
  }

  async setData(roomCode: string, winner: string) {
    const dbRef = firebaseRef(rtdb);

    const updatesRoom: any = {};
    updatesRoom[`${roomCode}/playing`] = false;
    updatesRoom[`${roomCode}/winner`] = winner;

    await update(dbRef, updatesRoom);
  }

  async getCargaDatos(roomCode: string) {
    const dbRef = firebaseRef(rtdb);
    const players = await get(child(dbRef, `${roomCode}/`))
      .then(async (snapshot) => {
        return snapshot.val().cargaDatos;
      })
      .catch((error) => {
        console.log(error);
        return 400;
      });
    return players;
  }

  async getCloseRoom(roomCode: string) {
    const dbRef = firebaseRef(rtdb);
    const close = await get(child(dbRef, `${roomCode}/`))
      .then(async (snapshot) => {
        return snapshot.val().close;
      })
      .catch((error) => {
        console.log(error);
        return 400;
      });
    return close;
  }

  async getPlayers(codeRoom: string) {
    const dbRef = firebaseRef(rtdb);
    const players = await get(child(dbRef, `${codeRoom}/players`))
      .then(async (snapshot) => {
        return snapshot.val();
      })
      .catch((error) => {
        console.log(error);
        return 400;
      });
    return players;
  }

  //Correct
  async roomData(roomCode: string): Promise<boolean> {
    const roomRef = firebaseRef(rtdb);
    const exists = await get(child(roomRef, `${roomCode}`)).then(
      async (snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return false;
        }
      }
    );
    return exists;
  }


  //Correct
  async runGame(salaCode: string): Promise<number> {
    const updates: any = {};
    updates[`/${salaCode}/ingreso`] = false;
    updates[`/${salaCode}/playing`] = true;

    await update(firebaseRef(rtdb), updates);

    return 201;
  }

  randCode(): string {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ";
    let lon = 8;
    let code = "";
    for (let x = 0; x < lon; x++) {
      let rand = Math.floor(Math.random() * chars.length);
      code += chars.substr(rand, 1);
    }
    return code;
  }

  async getRoom(roomCode: string): Promise<any> {
    const dbRef = firebaseRef(rtdb);
    const room = await get(child(dbRef, `${roomCode}/`))
      .then(async (snapshot) => {
        return snapshot.val();
      })
      .catch((error) => {
        console.log(error);
        return 400;
      });
    return room;
  }

  async getRoomBy(roomCode: string, filter: string): Promise<any> {
    let refFilter : string;
    switch (filter) {
      case "close":
        refFilter = `${roomCode}/close`;
        break;
      case "ingreso":
        refFilter = `${roomCode}/ingreso`;

        break;
      case "cargaPartidas":
        refFilter = `${roomCode}/cargaPartidas`;

        break;
      case "players":
        refFilter = `${roomCode}/players`;

        break;
      case "playing":
        refFilter = `${roomCode}/playing`;

        break;
      case "tipoJuego":
        refFilter = `${roomCode}/tipoJuego`;

        break;
      case "winner":
        refFilter = `${roomCode}/winner`;
        break;
        case "creador":
          refFilter = `${roomCode}/creador`;
          break;
      default:
        refFilter = `${roomCode}`;
        break;
    }
    const dbRef = firebaseRef(rtdb);
    const room = await get(child(dbRef, `${refFilter}`))
    .then(async (snapshot) => {
      return snapshot.val();
    })
    .catch((error) => {
      console.log(error);
      return 400;
    });
  return room;
  }

  async setRoomDataIndividual(roomCode: string, dni: string, win: boolean): Promise<number> {
    try {
      const updates: any = {};
      updates[`/${roomCode}/ingreso`] = false;
      updates[`/${roomCode}/close`] = true;
      updates[`/${roomCode}/playing`] = false;
      updates[`/${roomCode}/players/${dni}/order`] = 1;
      if (win) {
        updates[`/${roomCode}/winner`] = dni;
        updates[`/${roomCode}/players/${dni}/win`] = true;
      } else {
        updates[`/${roomCode}/winner`] = 0;
        updates[`/${roomCode}/players/${dni}/win`] = false;
      }
      await update(firebaseRef(rtdb), updates);
      return 200;
    } catch (error) {
      return 400;
    }
  }
}

export default new RoomRepository();

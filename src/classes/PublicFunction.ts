import {
  sendPasswordResetEmail,
  Auth,
} from "firebase/auth";
import { apiClientLocalidades } from "../boot/localidades";

class PublicFunction {
  //#region Login
  async sendEmailRecoverPassword(auth: Auth, email: string) {
    const emailSent = await sendPasswordResetEmail(auth, email)
      .then(() => {
        return 200;
      })
      .catch((error) => {
        console.log(error);
        if (error.code == "auth/invalid-email") {
          return "invalid-email";
        } else if (error.code == "auth/user-not-found") {
          return "user-not-found";
        } else {
          return "generic-error";
        }
      });
    return emailSent;
  }
  //#endregion

  //#region register
  pascalCase(cadena: string) : string {
    let cadenaSplit = cadena.toLowerCase().split(" ");
    for (let i = 0; i < cadenaSplit.length; i++) {
      cadenaSplit[i] =
        cadenaSplit[i].charAt(0).toUpperCase() + cadenaSplit[i].substring(1);
    }
    let pascalCaseCadena = cadenaSplit.join(" ");
    return pascalCaseCadena;
  }

  async getLocalidades(provincia: string): Promise<string[] | number> {
    const localidades = await apiClientLocalidades
      .get("/provincias/localidades.php?provincia=" + provincia)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return 400;
      });
    return localidades;
  }

  getDays(month: { label: string; value: number }): number[] {
    let days = [];
    if (
      month.label == "Enero" ||
      month.label == "Marzo" ||
      month.label == "Mayo" ||
      month.label == "Julio" ||
      month.label == "Agosto" ||
      month.label == "Octubre" ||
      month.label == "Diciembre"
    ) {
      for (let i = 0; i < 31; i++) {
        days.push(i + 1);
      }
    } else if (
      month.label == "Abril" ||
      month.label == "Junio" ||
      month.label == "Septiembre" ||
      month.label == "Noviembre"
    ) {
      for (let i = 0; i < 30; i++) {
        days.push(i + 1);
      }
    } else if (month.label == "Febrero") {
      for (let i = 0; i < 28; i++) {
        days.push(i + 1);
      }
    }
    return days;
  }

  async getProvincias() : Promise<string[] | number> {
    const provinciasCorrect = await apiClientLocalidades
    .get("/provincias/provincias.php")
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error);
      return 400;
    });
    return provinciasCorrect;
  }

  calcularEdad(birthDay: string) : number {
    let today = new Date();
    let birth = new Date(birthDay);
    let yearsOld = today.getFullYear() - birth.getFullYear();
    let m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      yearsOld--;
    }
    return yearsOld;
  }
  //#endregion
}

export default new PublicFunction();

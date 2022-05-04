import axios from 'axios'

const apiClientLocalidades = axios.create({
    baseURL: 'https://transitaseguro.com.ar/api'
})

export { apiClientLocalidades }
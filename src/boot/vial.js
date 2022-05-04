import axios from 'axios'

const apiClientVial = axios.create({
    baseURL: 'https://www.estudiorochayasoc.com/vial/'
})
export { apiClientVial }
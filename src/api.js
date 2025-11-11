import axios from 'axios'


const SWAPI = axios.create({ baseURL: 'https://swapi.dev/api/', timeout: 10000 })


export async function fetchPeople(page = 1) {
const res = await SWAPI.get(`people/?page=${page}`)
return res.data
}


export async function fetchResource(url) {
const res = await axios.get(url)
return res.data
}
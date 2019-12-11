import axios from 'axios';
import routes from '../router'

let base = 'http://127.0.0.1:8080';

export const requestLogin = params => {return axios.post(`${base}/login`, params).then(res => res.data); };
export const addUser = params => {return axios.post(`${base}/v1/user`,params);}


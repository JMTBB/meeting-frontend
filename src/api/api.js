import axios from 'axios';

// let base = 'http://localhost:8080/meetings/api';
let base = 'http://localhost:8080/meetings/api';

export const requestLogin = params => {return axios.post(`${base}/login`, params).then(res => res.data); };
export const addUser = params => {return axios.post(`${base}/v1/user`,params);}


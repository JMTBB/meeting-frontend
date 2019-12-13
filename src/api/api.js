import axios from 'axios';

// let base = 'http://localhost:8080/meetings/api';
// let bases = 'http://localhost:8080/meetings/api';
let base = '/apis';


//用户列表接口
export const requestLogin = params => {return axios.post(`${base}/login`, params).then(res => res.data); }
export const addUser = params => {return axios.post(`${base}/user`,params).then(res => res.data); }

//会议列表接口

export const addMeeting = params => { return axios.post(`${base}/meeting`, params).then(res => res.data); }
export const getMeeting = params => { return axios.get(`${base}/meeting`, params).then(res => res.data); }
export const getMeetingByUserId = params => { return axios.get(`${base}/meeting/${params}`).then(res => res.data); }
export const getMeetingPassed = params => { return axios.get(`${base}/passing/${params}`).then(res => res.data);}


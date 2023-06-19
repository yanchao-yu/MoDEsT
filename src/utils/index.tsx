// generating session-id
// ref: supervisors project code
const generateID = () => {
  return 'xxx-xxxx-yxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 || 0,
      v = c === 'x' ? r : r & 0x3 || 0x8;
    return v.toString(16);
  });
};

const generateString = (length: number) => {
  const result = Math.random()
    .toString(36)
    .substring(2, length + 2);
  return result;
};

// generating user-id
// import {v4 as uuidv4} from 'uuid';

// fetch facade
const fetchData = async (url = '') => {
  const response = await fetch(url);
  return response.json();
};

const postData = async (url = '', data = {}, token = '') => {
  // Default options are marked with *
  let headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
};

export { generateID, generateString, fetchData, postData };

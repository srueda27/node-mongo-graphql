import request from './request.mjs';
import { read } from './response.mjs';

function makeRequest(url, data) {
  request.send(url, data);
  return read();
}

const responseData = makeRequest('https://google.com', 'hello');

console.log(responseData)
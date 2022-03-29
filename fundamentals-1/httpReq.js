const { request } = require('http');

const req = request('http://www.gooogle.com', (response) => {
  response.on('data', (chunk) => {
    console.log(`Data chunk: ${chunk}`);
  })

  response.on('end', () => {
    console.log('No more data');
  })
});

req.end();

/**
 
const { get } = require('http');
 
const req = get('http://www.gooogle.com', (response) => {
  response.on('data', (chunk) => {
    console.log(`Data chunk: ${chunk}`);
  })

  response.on('end', () => {
    console.log('No more data');
  } )
});

 * 
 */
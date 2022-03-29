const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send(`Performance example: ${process.pid}`);
});

app.get('/timer', (req, res) => {
  delay(4000);
  res.send(`Beep Beep Beep!! ${process.pid}`);
});

function delay(duration) {
  const startTime = Date.now();
  while(Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

console.log('Worker process started...')
app.listen(3000);

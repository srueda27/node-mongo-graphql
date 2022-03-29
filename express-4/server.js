const express = require('express');

const friendsRouter = require('./routes/friends.routes');
const messagesRouter = require('./routes/messages.routes');

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log('listening on port: ', PORT)
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  const start = Date.now();

  next();
  
  const delta = Date.now() - start;
  console.log(`Total amount of time: ${delta} ms`);
});
 
app.use(express.json());

app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);
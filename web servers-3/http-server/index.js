const http = require('http');

const PORT = 3000;

const friends = [
  {
    id: 0,
    name: 'Isaac',
    message: 'Hello!'
  },
  {
    id: 1,
    name: 'Nikola',
    message: 'Best Hello!'
  }
]

//req is a stream use to read from the outside
//res is a stream use to write to the outside

const server = http.createServer((req, res) => {
  const items = req.url.split('/');

  if(req.method === 'POST' && items[1] === 'friends') {
    req.on('data', data => {
      //since data is a buffer we need to turn it into string
      const newFriend = data.toString();
      friends.push(JSON.parse(newFriend));
    });

    //returning exactly the same request from the browser
    // by piping to the response
    req.pipe(res);

  } else if(req.method === 'GET' && items[1] === 'friends') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
  
    res.end(JSON.stringify( friends.filter(friend => friend.id == items[2])[0] ));

  } else if (req.method === 'GET' && items[1] === 'messages') {
    //another way of setting headers
    res.setHeader('Content-Type', 'text/html');

    res.write('<html>');
    res.write('<body>');
    res.write('<ul>');
    res.write('<li> Helloo </li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();

  } else {
    res.statusCode = 404;
    res.end();
  }

});

server.listen(PORT, () => {
  console.log('listen')
});
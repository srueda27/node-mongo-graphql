const path = require('path');

function getPhoto(req, res) {
  const photoPath = path.join(__dirname, '..', 'public', 'Foto.jpg');
  res.sendFile(photoPath);
}

module.exports = {
  getPhoto
}
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with the defined storage configuration
const upload = multer({
  storage: storage,
}).single('image'); // Handling single file uploads

module.exports = upload;

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const postRoutes = require('./routes/post');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected');
  });

mongoose.connection.on('error', (err) => {
  console.log(`Database disconnected, error: ${err.message}`);
});

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use(fileUpload({uriDecodeFileNames: true}));
app.use(express.static('public'));
app.use(authRoutes);
app.use(usersRoutes);
app.use(profileRoutes);
app.use(postRoutes);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'You must log in',
    });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server is listening on the port: ${port}`);
});

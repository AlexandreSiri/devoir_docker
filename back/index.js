const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRouter = require('./src/routes/users');
const houseRouter = require('./src/routes/houses');

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ 
    limit: '50mb', 
    extended: true 
}));
app.use(cors());

app.use('/users', userRouter);
app.use('/houses', houseRouter);

const db = require("./src/models");
db.sequelize.sync()
  .then(() => {
    connect = "Synced db."
    console.log("Synced db.");
  })
  .catch((err) => {
    connect = "Failed to sync db: " + err.message
    console.log("Failed to sync db: " + err.message);
  });
 

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
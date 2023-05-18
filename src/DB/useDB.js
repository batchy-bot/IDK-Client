const mongoose = require('mongoose');

// const mongoString = "mongodb+srv://batchy_bot:Tilapia-626@cluster0.kqimzoq.mongodb.net/?retryWrites=true&w=majority";

const mongoString = 'localhost:27017'

const connectDB = () => {
  mongoose.connect(mongoString + "/idk-socmed", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: { w: "majority" },
  })
    .then(() => {
      console.log('Connected to Database');
    })
    .catch((error) => {
      console.error('Error connecting to Database:', error);
    });
};

module.exports = connectDB;

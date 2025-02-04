const mongoose = require("mongoose");

const Infographic = new mongoose.Schema({
  title: {
    type: String,
    
  },
  photo: {
    type: String, // Store the filename or path of the photo
    
  },
  imgTitle: {
    type: String,
    
  },
  altName: {
    type: String,
    
  },
  description: {
    type: String,
    
  },
}, { timestamps: true });

module.exports = mongoose.model("infographic", Infographic);


const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: true,
      enum: ["home", "about"],
      unique: true,
      lowercase: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    subtitle: {
      type: String,
      default: "",
      trim: true
    },

    content: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ""
    },

    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Page", pageSchema);
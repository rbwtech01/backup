const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    features: {
      type: [String],
      default: []
    },

    specifications: {
      type: [
        {
          label: {
            type: String,
            required: true
          },
          value: {
            type: String,
            required: true
          }
        }
      ],
      default: []
    },

    images: {
      type: [String],
      default: []
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

module.exports = mongoose.model("Machine", machineSchema);
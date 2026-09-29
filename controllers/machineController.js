
const mongoose = require("mongoose");
const Machine = require("../models/machineModel");

// CREATE MACHINE
const createMachine = async (req, res) => {
  try {
    const {
      name,
      slug,
      shortDescription,
      description,
      category,
      features,
      specifications,
      images,
      isPublished
    } = req.body;

    if (
      !name ||
      !slug ||
      !shortDescription ||
      !description ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, slug, short description, description, and category are required."
      });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const existingMachine = await Machine.findOne({
      slug: normalizedSlug
    });

    if (existingMachine) {
      return res.status(409).json({
        success: false,
        message: "A machine with this slug already exists."
      });
    }

    const machine = await Machine.create({
      name,
      slug: normalizedSlug,
      shortDescription,
      description,
      category,
      features,
      specifications,
      images,
      isPublished
    });

    return res.status(201).json({
      success: true,
      message: "Machine created successfully.",
      data: machine
    });
  } catch (error) {
    console.error("Create machine error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This machine slug already exists."
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};


// GET ALL MACHINES (ADMIN)
const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: machines.length,
      data: machines
    });
  } catch (error) {
    console.error("Get machines error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};


// GET SINGLE MACHINE BY ID
const getMachine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid machine ID."
      });
    }

    const machine = await Machine.findById(id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: machine
    });
  } catch (error) {
    console.error("Get machine error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};


// UPDATE MACHINE
const updateMachine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid machine ID."
      });
    }

    const allowedFields = [
      "name",
      "slug",
      "shortDescription",
      "description",
      "category",
      "features",
      "specifications",
      "images",
      "isPublished"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update."
      });
    }

    if (updates.slug !== undefined) {
      if (typeof updates.slug !== "string" || !updates.slug.trim()) {
        return res.status(400).json({
          success: false,
          message: "Slug must be a non-empty string."
        });
      }

      updates.slug = updates.slug.trim().toLowerCase();
    }

    const machine = await Machine.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Machine updated successfully.",
      data: machine
    });
  } catch (error) {
    console.error("Update machine error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This machine slug already exists."
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};


// DELETE MACHINE
const deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid machine ID."
      });
    }

    const machine = await Machine.findByIdAndDelete(id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Machine deleted successfully."
    });
  } catch (error) {
    console.error("Delete machine error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};


module.exports = {
  createMachine,
  getMachines,
  getMachine,
  updateMachine,
  deleteMachine
};

const Page = require("../models/pageModel");

const allowedPages = ["home", "about"];


// ADMIN: GET PAGE
const getAdminPage = async (req, res) => {
  try {
    const { pageName } = req.params;

    if (!allowedPages.includes(pageName)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page name. Use home or about."
      });
    }

    const page = await Page.findOne({ pageName });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page content not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error("Get admin page error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};


// ADMIN: CREATE OR UPDATE PAGE
const upsertPage = async (req, res) => {
  try {
    const { pageName } = req.params;

    const {
      title,
      subtitle,
      content,
      image,
      isPublished
    } = req.body;

    if (!allowedPages.includes(pageName)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page name. Use home or about."
      });
    }

    // Validate required fields when creating a page.
    const existingPage = await Page.findOne({ pageName });

    if (!existingPage && (
      typeof title !== "string" || !title.trim() ||
      typeof content !== "string" || !content.trim()
    )) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required when creating a page."
      });
    }

    // Validate supplied fields.
    if (title !== undefined &&
        (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({
        success: false,
        message: "Title must be a non-empty string."
      });
    }

    if (content !== undefined &&
        (typeof content !== "string" || !content.trim())) {
      return res.status(400).json({
        success: false,
        message: "Content must be a non-empty string."
      });
    }

    if (subtitle !== undefined && typeof subtitle !== "string") {
      return res.status(400).json({
        success: false,
        message: "Subtitle must be a string."
      });
    }

    if (image !== undefined && typeof image !== "string") {
      return res.status(400).json({
        success: false,
        message: "Image must be a string."
      });
    }

    if (
      isPublished !== undefined &&
      typeof isPublished !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isPublished must be true or false."
      });
    }

    // Build only the fields the admin supplied.
    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (subtitle !== undefined) updates.subtitle = subtitle.trim();
    if (content !== undefined) updates.content = content;
    if (image !== undefined) updates.image = image.trim();

    if (isPublished !== undefined) {
      updates.isPublished = isPublished;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update."
      });
    }

    const page = await Page.findOneAndUpdate(
      { pageName },
      {
        $set: updates,
        $setOnInsert: { pageName }
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Page saved successfully.",
      data: page
    });
  } catch (error) {
    console.error("Save page error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This page already exists. Please retry."
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


// PUBLIC: GET PUBLISHED PAGE
const getPublicPage = async (req, res) => {
  try {
    const { pageName } = req.params;

    if (!allowedPages.includes(pageName)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page name. Use home or about."
      });
    }

    const page = await Page.findOne({
      pageName,
      isPublished: true
    }).select("pageName title subtitle content image updatedAt");

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Published page not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error("Get public page error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};


module.exports = {
  getAdminPage,
  upsertPage,
  getPublicPage
};
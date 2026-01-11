const { Router } = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Members = require("../models/Members");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const membersRoutes = Router();

membersRoutes.param("id", async (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const member = await Members.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    req.member = member;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

membersRoutes.get("/", async (req, res) => {
  try {
    const members = await Members.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

membersRoutes.get("/:id", (req, res) => {
  try {
    res.send(req.member);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

membersRoutes.post("/", upload.single("avatar"), async (req, res) => {
  req.body.avatar = req.file.filename;
  try {
    const newMember = new Members(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

membersRoutes.put("/:id", async (req, res) => {
  try {
    const updatedMember = await Members.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

membersRoutes.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await Members.findByIdAndDelete(req.params.id);
    fs.unlink(`./uploads/${deletedMember.avatar}`, (err) => {
      if (err) {
        console.error("Error deleting avatar:", err);
        return;
      }
      console.log("avatar deleted successfully!");
    });
    res.json(deletedMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = membersRoutes;

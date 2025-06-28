const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["Ordinary", "Admin", "Agent"], required: true },
});

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Assigned", "Resolved"] },
}, { timestamps: true });

// Assigned Complaint Schema
const assignedComplaintSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, default: "Assigned", enum: ["Assigned", "Resolved"] },
}, { timestamps: true });

// Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true },
}, { timestamps: true });

module.exports = {
  UserSchema: mongoose.model("User", userSchema),
  ComplaintSchema: mongoose.model("Complaint", complaintSchema),
  AssignedComplaint: mongoose.model("AssignedComplaint", assignedComplaintSchema),
  MessageSchema: mongoose.model("Message", messageSchema),
};

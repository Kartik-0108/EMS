import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});

export default mongoose.model("Employee", employeeSchema);
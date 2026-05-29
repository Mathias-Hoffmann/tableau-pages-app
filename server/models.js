import mongoose from "mongoose";

const checkboxSchema = new mongoose.Schema(
  {
    rowKey: String,
    column: String,
    checked: Boolean,
  },
  { timestamps: true }
);

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, unique: true },
    checked: Boolean,
  },
  { timestamps: true }
);

export const Checkbox = mongoose.model("Checkbox", checkboxSchema);
export const Vehicle = mongoose.model("Vehicle", vehicleSchema);

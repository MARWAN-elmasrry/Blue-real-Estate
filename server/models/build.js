import mongoose from "mongoose";

const ApartmentSchema = new mongoose.Schema({
  apartmentNumber: {
    type: Number,
    required: true,
  },

  floorNumber: {
    type: Number,
    required: true,
  },

  tenantName: {
    type: String,
    trim: true,
    default: "",  
  },

  tenantPhone: {
    type: String,
    trim: true,
    default: "",  
  },

  status: {
    type: String,
    enum: ["Occupied", "Vacant"],
    default: "Vacant",
  },

  monthlyRent: {
    type: Number,
    default: 0,  
  },

  rentIncreasePerYear: {
    type: Number,
    default: 0,
  },

  contractStartDate: {
    type: Date,
    default: null,  
  },

  contractEndDate: {
    type: Date,
    default: null,  
  },
});

const BuildingSchema = new mongoose.Schema(
  {
    buildingName: {
      type: String,
      required: true,
      trim: true,
    },

    buildingNumber: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    apartments: [ApartmentSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Building", BuildingSchema);

import mongoose from 'mongoose';
import BuildingSchema from '../models/build.js';


// CREATE - Add a new building with apartments
export const addBuilding = async (req, res) => {
  try {
    const { buildingName, buildingNumber, location, numberOfApartments, apartmentsPerFloor } = req.body;

    const apartments = [];
    for (let i = 1; i <= numberOfApartments; i++) {
      apartments.push({
        apartmentNumber: i,
        floorNumber: Math.ceil(i / apartmentsPerFloor), 
        tenantName: "",
        tenantPhone: "",
        status: "Vacant",
        monthlyRent: 0,
        rentIncreasePerYear: 0,
        contractStartDate: null,
        contractEndDate: null,
      });
    }

    const building = new BuildingSchema({
      buildingName,
      buildingNumber,
      location,
      apartments,
    });

    await building.save();
    res.status(201).json({ message: "Building added successfully", building });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// READ - Get all buildings
export const getAllBuildings = async (req, res) => {
  try {
    const buildings = await BuildingSchema.find().select('buildingName buildingNumber location apartments');
    
    const formattedBuildings = buildings.map(building => ({
      _id: building._id,
      buildingName: building.buildingName,
      buildingNumber: building.buildingNumber,
      location: building.location,
      apartmentsCount: building.apartments?.length || 0
    }));

    res.status(200).json({
      success: true,
      count: formattedBuildings.length,
      buildings: formattedBuildings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// READ - Get single building by ID
export const getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid building ID" });
    }

    const building = await BuildingSchema.findById(id);

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    res.status(200).json({ success: true, building });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// UPDATE - Update specific apartment by building ID and apartment number
export const updateApartment = async (req, res) => {
  try {
    const { id, apartmentNumber } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid building ID" });
    }

    const building = await BuildingSchema.findById(id);

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    const apartmentIndex = building.apartments.findIndex(
      apt => apt.apartmentNumber === parseInt(apartmentNumber)
    );

    if (apartmentIndex === -1) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    // Update apartment fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        building.apartments[apartmentIndex][key] = updateData[key];
      }
    });

    await building.save();

    res.status(200).json({ 
      message: "Apartment updated successfully", 
      apartment: building.apartments[apartmentIndex] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const triggerRentUpdate = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const buildings = await BuildingSchema.find();
    const updates = [];
    let updatedCount = 0;

    for (const building of buildings) {
      let buildingModified = false;

      for (const apartment of building.apartments) {
        if (
          apartment.status === 'Occupied' &&
          apartment.contractStartDate &&
          apartment.rentIncreasePerYear > 0
        ) {
          const contractStart = new Date(apartment.contractStartDate);
          contractStart.setHours(0, 0, 0, 0);

          if (
            contractStart.getMonth() === today.getMonth() &&
            contractStart.getDate() === today.getDate() &&
            today.getFullYear() > contractStart.getFullYear()
          ) {
            const oldRent = apartment.monthlyRent;
            const newRent = Math.round(oldRent * (1 + apartment.rentIncreasePerYear / 100));

            apartment.monthlyRent = newRent;
            buildingModified = true;
            updatedCount++;

            updates.push({
              buildingName: building.buildingName,
              apartmentNumber: apartment.apartmentNumber,
              tenantName: apartment.tenantName,
              oldRent,
              newRent,
              increasePercentage: apartment.rentIncreasePerYear
            });
          }
        }
      }

      if (buildingModified) {
        await building.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Rent update completed`,
      updatedCount,
      updates
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Server Error", 
      error: error.message 
    });
  }
};

export const clearApartment = async (req, res) => {
  try {
    const { id , apartmentNumber } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid building ID" });
    }

    const building = await BuildingSchema.findById(id);

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    const apartmentIndex = building.apartments.findIndex(
      apt => apt.apartmentNumber === parseInt(apartmentNumber)
    );

    if (apartmentIndex === -1) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    // Clear apartment data - reset to vacant state
    building.apartments[apartmentIndex].tenantName = "";
    building.apartments[apartmentIndex].tenantPhone = "";
    building.apartments[apartmentIndex].status = "Vacant";
    building.apartments[apartmentIndex].monthlyRent = 0;
    building.apartments[apartmentIndex].rentIncreasePerYear = 0;
    building.apartments[apartmentIndex].contractStartDate = null;
    building.apartments[apartmentIndex].contractEndDate = null;

    await building.save();

    res.status(200).json({ 
      success: true,
      message: "Apartment cleared successfully", 
      apartment: building.apartments[apartmentIndex] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Server Error", 
      error: error.message 
    });
  }
};
import cron from 'node-cron';
import BuildingSchema from '../models/build.js';

const updateAnnualRents = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`🔄 Running rent update job at ${today.toLocaleString()}`);

    const buildings = await BuildingSchema.find();
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

          // Check if today is anniversary
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

            console.log(
              `💰 Building: ${building.buildingName}, Apt ${apartment.apartmentNumber}: ` +
              `${oldRent} EGP -> ${newRent} EGP (${apartment.rentIncreasePerYear}% increase)`
            );
          }
        }
      }

      if (buildingModified) {
        await building.save();
      }
    }

    if (updatedCount > 0) {
      console.log(`✅ Rent update completed. Updated ${updatedCount} apartment(s)`);
    } else {
      console.log(`ℹ️ No apartments due for rent increase today`);
    }
  } catch (error) {
    console.error('❌ Error updating rents:', error);
  }
};

// PRODUCTION: Run every day at 1:00 AM
export const startRentUpdateScheduler = () => {
  cron.schedule('0 1 * * *', updateAnnualRents);
  console.log('✅ Rent update scheduler started - runs daily at 1:00 AM');
};

export { updateAnnualRents };
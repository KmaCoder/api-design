import { DataSource } from 'typeorm';
import dataSource from './data-source';
import { Route } from '../routes/entities/route.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { ScheduleStatus } from '../schedules/dto/schedule.dto';

// River port locations for realistic data
const riverLocations = [
  'Harbor Point', 'Riverside Dock', 'Marina Bay', 'Port Franklin',
  'Waterfront Terminal', 'River Junction', 'Northbank Pier', 'Southside Harbor',
  'Echo Bay', 'Lakeside Terminal', 'Canal District', 'Bayview Port'
];

// Function to get a random element from an array
const getRandomElement = (array: any[]) => array[Math.floor(Math.random() * array.length)];

// Function to get a random future date within the specified range of days
const getRandomFutureDate = (minDaysFromNow: number, maxDaysFromNow: number) => {
  const now = new Date();
  const futureDate = new Date(now);
  const randomDays = Math.floor(Math.random() * (maxDaysFromNow - minDaysFromNow + 1)) + minDaysFromNow;
  futureDate.setDate(now.getDate() + randomDays);
  return futureDate;
};

// Function to get a random duration in hours (for the trip duration)
const getRandomDuration = (minHours: number, maxHours: number) => {
  return Math.floor(Math.random() * (maxHours - minHours + 1)) + minHours;
};

async function seed() {
  try {
    // Initialize the database connection
    await dataSource.initialize();
    console.log('Database connection initialized');

    // Routes data
    const routesData: Partial<Route>[] = [];
    
    for (let i = 1; i <= 10; i++) {
      const startLocation = getRandomElement(riverLocations);
      let endLocation = getRandomElement(riverLocations);
      
      // Ensure start and end locations are different
      while (endLocation === startLocation) {
        endLocation = getRandomElement(riverLocations);
      }
      
      routesData.push({
        name: `Route ${i}`,
        startLocation,
        endLocation,
        distance: parseFloat((Math.random() * 50 + 5).toFixed(2)) // Between 5 and 55 km
      });
    }

    // Save the routes to get their IDs
    const routeRepository = dataSource.getRepository(Route);
    const savedRoutes = await routeRepository.save(routesData);
    console.log(`Created ${savedRoutes.length} routes`);

    // Generate schedule data
    const schedulesData: Partial<Schedule>[] = [];
    
    for (let i = 1; i <= 10; i++) {
      const route = getRandomElement(savedRoutes);
      const departureTime = getRandomFutureDate(1, 30); // Between 1 and 30 days from now
      const durationHours = getRandomDuration(1, 4); // Between 1 and 4 hours
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(departureTime.getHours() + durationHours);
      
      schedulesData.push({
        routeId: route.id,
        boatId: `boat-${Math.floor(Math.random() * 100) + 1}`,
        departureTime,
        arrivalTime,
        status: ScheduleStatus.SCHEDULED
      });
    }

    // Save the schedules
    const scheduleRepository = dataSource.getRepository(Schedule);
    const savedSchedules = await scheduleRepository.save(schedulesData);
    console.log(`Created ${savedSchedules.length} schedules`);

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seed process:', error);
  } finally {
    // Close the database connection after seeding
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

// Run the seed function
seed(); 
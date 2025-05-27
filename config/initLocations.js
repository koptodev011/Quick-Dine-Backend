// config/initLocations.js
import Country from '../models/countryModel.js';
import State from '../models/stateModel.js';

const initLocations = async () => {
  try {
    // Check if India already exists
    let india = await Country.findOne({ where: { code: 'IND' } });
    
    if (!india) {
    // Add countries
    india = await Country.create({
      name: 'India',
      code: 'IND',
      active: true
    });

    // Add states for India
    }

    // Check if states exist
    const existingStates = await State.findAll({
      where: { country_id: india.id }
    });

    if (existingStates.length === 0) {
      await State.bulkCreate([
      {
        name: 'Maharashtra',
        country_id: india.id,
        active: true
      },
      {
        name: 'Karnataka',
        country_id: india.id,
        active: true
      },
      {
        name: 'Tamil Nadu',
        country_id: india.id,
        active: true
      },
      {
        name: 'Gujarat',
        country_id: india.id,
        active: true
      },
      {
        name: 'Delhi',
        country_id: india.id
      }
    ]);

      console.log('States initialized successfully');
    } else {
      console.log('States already exist, skipping initialization');
    }
    console.log('Locations initialization completed');
  } catch (error) {
    console.error('Error initializing locations:', error);
  }
};

export default initLocations;

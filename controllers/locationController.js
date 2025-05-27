// controllers/locationController.js
import { State, Country } from '../models/index.js';

// Get all states by country ID
export const getStatesByCountry = async (req, res) => {
  try {
    const { country_id } = req.params;

    const states = await State.findAll({
      where: {
        country_id: country_id,
        active: true
      },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: states
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching states',
      error: error.message
    });
  }
};

// Get all countries
export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      where: {
        active: true
      },
      attributes: ['id', 'name', 'code'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: countries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching countries',
      error: error.message
    });
  }
};

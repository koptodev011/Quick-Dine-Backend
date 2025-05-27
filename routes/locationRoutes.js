// routes/locationRoutes.js
import express from 'express';
import { getStatesByCountry, getAllCountries } from '../controllers/locationController.js';

const router = express.Router();

// Get all states by country ID
router.get('/states/:country_id', getStatesByCountry);

// Get all countries
router.get('/countries', getAllCountries);

export default router;

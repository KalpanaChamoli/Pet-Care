const express = require('express');
const { param, query } = require('express-validator');
const petController = require('../controllers/petController');

const Router = express.Router();

// Route for adding a new pet
Router.post('/', [
  // Validation for the body of the request (optional)
  // Add express-validator validation for input fields if required
], petController.addPet);

// Route for getting all pets (with pagination support)
Router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
], petController.getAllPets);

// Route for getting a specific pet by its ID
Router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid pet ID format'),
], petController.getPet);

// Route for deleting a pet by its ID
Router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid pet ID format'),
], petController.deletePet);

module.exports = Router;

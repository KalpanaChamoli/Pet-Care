const Pet = require('../Models/petModel');
const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { validationResult } = require('express-validator');

exports.addPet = catchAsync(async (req, res, next) => {
  // Validation for required fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Invalid input data', 400));
  }

  const pet = await Pet.create({
    name: req.body.name,
    image: req.body.image || null,
    breed: req.body.breed,
    color: req.body.color,
    location: req.body.location,
    species: req.body.species,
    gender: req.body.gender,
  });

  res.status(201).json({
    message: 'success',
    data: { pet },
  });
});

exports.getAllPets = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const pets = await Pet.find()
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    message: 'success',
    data: { pets },
  });
});

exports.getPet = catchAsync(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) {
    return next(new AppError('Pet not found with that ID', 404));
  }

  res.status(200).json({
    message: 'success',
    data: { pet },
  });
});

exports.deletePet = catchAsync(async (req, res, next) => {
  const pet = await Pet.findByIdAndDelete(req.params.id);
  if (!pet) {
    return next(new AppError('Pet not found with that ID', 404));
  }

  res.status(200).json({
    message: 'success',
  });
});

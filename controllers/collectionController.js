const Collection = require('../models/Collection');

// @desc    Get all collections
// @route   GET /api/collections
exports.getAllCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find();
    res.status(200).json({ success: true, count: collections.length, data: collections });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single collection by ID
// @route   GET /api/collections/:id
exports.getCollectionById = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection event not found' });
    }
    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a collection assignment
// @route   POST /api/collections
exports.createCollection = async (req, res, next) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Update collection assignment/status
// @route   PUT /api/collections/:id
exports.updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection event not found' });
    }
    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a collection entry
// @route   DELETE /api/collections/:id
exports.deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection event not found' });
    }
    res.status(200).json({ success: true, message: 'Collection event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
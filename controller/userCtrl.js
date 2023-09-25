const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwtToken');

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // create new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    res.status(400);
    throw new Error('User already exists');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),

    });
  } else {
    throw new Error('Invalid email or password');
  }
});

// update user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateUser = await User.findByIdAndUpdate(id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      }, { new: true });
    res.json(updateUser);
  } catch (err) {
    throw new Error(err);
  }
});

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (err) {
    throw new Error(err);
  }
});

// get one user
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getUser = await User.findById(id);
    res.json(getUser);
  }
  catch (err) {
    throw new Error(err);
  }
});

// delete one user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  }
  catch (err) {
    throw new Error(err);
  }
});

module.exports = { createUser, loginUser, updateUser , getAllUsers, getUser, deleteUser };

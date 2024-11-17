const express = require('express');
const UserModel = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');
const generateToken = require('../Config/generateToken');

const loginController = expressAsyncHandler(async(req, res) => {
  const { name,password } = req.body;
  const user = await UserModel.findOne({ name});
  if (user && (await user.matchPassword(password))) {
    const response =({
      _id:user._id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin,
      token:generateToken(user._id),
    });
    res.json(response);

  } else {
    res.send(401);
    throw new Error('Invalid email or password');
  }
});

const registerController = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //Check if all necessary fields are filled
    if (!name || !email || !password) {
        res.send(400);
        throw Error("All necessary input fields have not been filled");
    }

    //pre-existing user check
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      // res.send(405);
      throw new Error("User already Exists");
    }

    //userName already exists check
    const userNameExist = await UserModel.findOne({ name });    
    if (userNameExist) {
      // res.send(405);
      throw new Error("User Name already Exists");
    }

    //create an entry in the database
    const user = await UserModel.create({ name, email, password });
    if (user) {
        res.status(201).json({
          _id:user._id,
          name:user.name,
          email:user.email,
          isAdmin:user.isAdmin,
          token:generateToken(user._id),
        });
    } else {
        res.send(400);
        throw new Error("Invalid user data");
    }

    
});

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

module.exports = { loginController, registerController,fetchAllUsersController };
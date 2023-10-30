import express from 'express';
import { getAllUsersCtrl, getUserProfileCtrl, loginUserCtrl, registerUserCtrl,updateShippingAddress } from '../controllers/usersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';


const userRoutes = express.Router();

userRoutes.post('/register', registerUserCtrl);
userRoutes.post('/login',loginUserCtrl);
userRoutes.get('/profile',isLoggedIn, getUserProfileCtrl);
userRoutes.put('/update/shipping',isLoggedIn,updateShippingAddress);
userRoutes.get('/allUsers',isLoggedIn,isAdmin,getAllUsersCtrl);


export default userRoutes;
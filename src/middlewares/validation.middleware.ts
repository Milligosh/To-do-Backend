const  { responseProvider }  = require('../helper/response');
import {Request, Response, NextFunction} from 'express'



export const validateSignUpApplicantInput = (req:Request, res:Response, next:NextFunction) => {

  try {
    const { email, firstname, lastname,username, password, phonenumber } = req.body;


    if (typeof email !== 'string' || !email.includes('@')) {
      return responseProvider( res, null, 'provide a valid email', 400)
    }

    if (typeof firstname !== 'string' || !firstname) {
      return responseProvider( res, null, 'provide a valid firstname', 400)
    }


    if (typeof lastname !== 'string' || !lastname) {
      return responseProvider( res, null, 'provide a valid lastname', 400)
    }
    if (typeof username !== 'string'|| !username){
        return responseProvider (res ,null,'provide a valid username',400)
    }

    if (typeof password !== 'string' || password.length < 8) {
      return responseProvider( res, null, 'provide a valid password', 400)
    }

    if (typeof parseInt(phonenumber) !== 'number' || phonenumber.length < 10) {
      return responseProvider( res, null, 'provide a valid phone number', 400)
    }


    return next();
  } catch (error) {
    return next(error);
  }
};
// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import config from "../config/env/development";

// export default function authenticateToken(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (token == null) {
//     return res.sendStatus(401);
//   }

//   jwt.verify(token, config.JWT_SECRET as string, (err, user) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     (req as any).user = user;
//     next();
//   });
// }
import jwt, { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import config from "../config/env/development";

dotenv.config();

const checkAuthorizationToken = (authorization: string | undefined): string | null => {
    let bearerToken: string | null = null;
    if (authorization) {
        const token = authorization.split(' ')[1];
        bearerToken = token || authorization;
    }
    return bearerToken;
}

const verifyToken = (token: string, JWT_SECRET: string): any => {
    return verify(token, JWT_SECRET);
}

export default function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers["authorization"];
    const token = checkAuthorizationToken(authHeader);

    if (!token) {
        throw{
          code:404,
          message:'invalid token',
          status:'fail',
          data:null
        }
    }

    try {
      (req as any).user = verifyToken(token, config.JWT_SECRET as string);
        next();
    } catch (err) {
        next (err)
    }
}




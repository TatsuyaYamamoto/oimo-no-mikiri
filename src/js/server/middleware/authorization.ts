import { UNAUTHORIZED } from "http-status-codes";
import { Response, Request, NextFunction } from "express";
import { auth } from "firebase-admin";

export default async (req: Request, res: Response, next: NextFunction) => {
    // get token with header or cookies.
    const authorization = req.header("Authorization");
    let token = "";
    if (authorization && authorization.startsWith("Bearer ")) {
        token = authorization.split("Bearer ")[1];
    } else if (req.cookies) {
        token = req.cookies.__session;
    }

    try {
        res.locals.token = await auth().verifyIdToken(token);
        next();
    } catch (e) {
        res.status(UNAUTHORIZED).send(e.message);
    }
};

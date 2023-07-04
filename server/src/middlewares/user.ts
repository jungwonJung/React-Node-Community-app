import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // first check this user data validate user or not
    const token = req.cookies.token;
    console.log("token", token);
    if (!token) return next();

    // checked username is varificate or not
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    // with username find User data
    const user = await User.findOneBy({ username });

    console.log("user", user);
    // if not validate user then throw error
    if (!user) throw new Error("Unauthenticated");

    // save user Data to res.locals.user
    res.locals.user = user;
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went Wrong" });
  }
};

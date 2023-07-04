import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";
import Sub from "../entities/Sub";

const createSub = async (req: Request, res: Response, next: NextFunction) => {
  const { name, title, description } = req.body;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "The community name cannot be left blank.";
    if (isEmpty(title))
      errors.title = "The community title cannot be left blank";

    const sub = await getRepository<Sub>(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "A sub-community with the same name already exists";

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const user: User = res.locals.user;
    const sub = new Sub();

    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = user;

    // save sub-community data to DB

    await sub.save();
    // and return to client side
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

// To enable community creation,
// it is necessary to continuously verify if the user is valid.
// To achieve this, a middleware for validating the user's data and token needs to be created.
// The middleware will perform these checks before sending the actual request.
router.post("/", userMiddleware, authMiddleware, createSub);
export default router;

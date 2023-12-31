import { Request, Response, Router } from "express";
import User from "../entities/User";
import { isEmpty, validate } from "class-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

const mapErrors = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];

    return prev;
  }, {});
};

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    // Check if these email and username are already saved

    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // If they are already saved, add them to the errors object and return it

    if (emailUser) errors.email = "The Email is already in used";
    if (usernameUser) errors.username = "The User Name is already in used";

    // if have errors return to errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // validate data check with Entity s condition
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapErrors(errors));

    // save user Information to User data Table

    await user.save();
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};
    // if data s empty send errors to client side
    if (isEmpty(username)) errors.username = "The username cannot be empty.";
    if (isEmpty(password)) errors.password = "The password cannot be empty.";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // find user in DB
    const user = await User.findOneBy({ username });

    if (!user)
      return res
        .status(404)
        .json({ username: "The username has not been registered." });

    // if find user compared with password
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ password: "This password is wrong" });
    }

    // if matched correct password make Token
    const token = jwt.sign({ username }, process.env.JWT_SECRET!);

    // save cookie
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: "/",
      })
    );

    return res.json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const logout = async (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );
  res.status(200).json({ success: true });
};

const router = Router();
router.get("/me", userMiddleware, authMiddleware, me);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", userMiddleware, authMiddleware, logout);

export default router;

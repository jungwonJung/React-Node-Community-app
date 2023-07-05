import { NextFunction, Request, Response, Router } from "express";
import User from "../entities/User";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import Sub from "../entities/Sub";
import { AppDataSource } from "../data-source";
import Post from "../entities/Post";
import multer, { FileFilterCallback } from "multer";
import { makeId } from "../utils/helper";
import { unlinkSync } from "fs";
import path from "path";

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const sub = await Sub.findOneByOrFail({ name });

    //after created post ,add created post to main sub-community
    const post = await Post.find({
      where: { subName: sub.name },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });

    sub.posts = post;
    if (res.locals.user) {
      sub.posts.forEach((p) => {
        p.setUserVote(res.locals.user);
      });
    }

    return res.json(sub);
  } catch (error) {
    return res.status(404).json({ error: "Cannot Find Sub-Community" });
  }
};

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "The community name cannot be left blank.";
    if (isEmpty(title))
      errors.title = "The community title cannot be left blank";

    const sub = await AppDataSource.getRepository(Sub)
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

const topSubs = async (req: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" ,
     'https://www.gravatar.com/avatar/?d=mp&f=y')`;

    const subs = await AppDataSource.createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name = p."subName"`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute();

    return res.json(subs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;

  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

    if (sub.username !== user.username) {
      return res
        .status(403)
        .json({ error: "You are not the creator of this community" });
    }

    res.locals.sub = sub;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Wrong" });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(10);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
    } else {
      callback(new Error("이미지가 아닙니다."));
    }
  },
});

const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;
    // If no file type is specified, delete the uploaded file.
    if (type !== "image" && type !== "banner") {
      if (!req.file?.path) {
        return res.status(400).json({ error: "Invalid file" });
      }

      // delete firls
      unlinkSync(req.file.path);
      return res.status(400).json({ error: "Incorrect file type" });
    }

    let oldImageUrn: string = "";

    if (type === "image") {
      // using URN saved for delete file
      oldImageUrn = sub.imageUrn || "";
      // edite new file name to URN
      sub.imageUrn = req.file?.filename || "";
    } else if (type === "banner") {
      oldImageUrn = sub.bannerUrn || "";
      sub.bannerUrn = req.file?.filename || "";
    }
    await sub.save();

    // delete not using image
    if (oldImageUrn !== "") {
      const fullFilename = path.resolve(
        process.cwd(),
        "public",
        "images",
        oldImageUrn
      );
      unlinkSync(fullFilename);
    }

    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Wrong." });
  }
};

const router = Router();

// To enable community creation,
// it is necessary to continuously verify if the user is valid.
// To achieve this, a middleware for validating the user's data and token needs to be created.
// The middleware will perform these checks before sending the actual request.
router.post("/", userMiddleware, authMiddleware, createSub);
router.get("/sub/topSubs", topSubs);
router.get("/:name", userMiddleware, getSub);
router.post(
  "/:name/upload",
  userMiddleware,
  authMiddleware,
  ownSub,
  upload.single("file"),
  uploadSubImage
);
export default router;

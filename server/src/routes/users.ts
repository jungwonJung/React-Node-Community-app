import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import User from "../entities/User";
import Post from "../entities/Post";
import Comment from "../entities/Comments";

const getUserData = async (req: Request, res: Response) => {
  try {
    // get user data
    const user = await User.findOneOrFail({
      where: { username: req.params.username },
      select: ["username", "createdAt"],
    });

    // get user s post data
    const posts = await Post.find({
      where: { username: user.username },
      relations: ["comments", "votes", "sub"],
    });

    // get user s comment s data
    const comments = await Comment.find({
      where: { username: user.username },
      relations: ["post"],
    });

    if (res.locals.user) {
      const { user } = res.locals;
      posts.forEach((p) => p.setUserVote(user));
      comments.forEach((c) => c.setUserVote(user));
    }

    let userData: any[] = [];

    // The reason for using toJson is to create a new object when making a copy using the spread operator ({...}).
    // If you directly copy an object instance, the getters defined with @Express will not be included in the new object.
    // Therefore, by converting the object to JSON and then copying it
    // you can ensure that all the necessary properties and values are included in the new object.
    posts.forEach((p) => userData.push({ type: "Post", ...p.toJSON() }));
    comments.forEach((c) => userData.push({ type: "Comment", ...c.toJSON() }));

    // sort with recently
    userData.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });
    return res.json({ user, userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();
router.get("/:username", userMiddleware, getUserData);

export default router;

import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import User from "../entities/User";
import Post from "../entities/Post";
import Vote from "../entities/Vote";
import Comment from "../entities/Comments";

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  // checked data only with -1 0 1
  if (![-1, 0, 1].includes(value)) {
    return res
      .status(400)
      .json({ value: "Only values of -1, 0, and 1 are allowed" });
  }

  try {
    const user: User = res.locals.user;
    let post: Post | undefined = await Post.findOneByOrFail({
      identifier,
      slug,
    });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      // if have commentIdentifier find cooments vote value with this CommentIdentifier
      comment = await Comment.findOneByOrFail({
        identifier: commentIdentifier,
      });
      vote = await Vote.findOneBy({
        username: user.username,
        commentId: comment.id,
      });
    } else {
      // find vote value with post data
      vote = await Vote.findOneBy({ username: user.username, postId: post.id });
    }

    if (!vote && value === 0) {
      // without vote and value === 0 return error
      return res.status(404).json({ error: "Cannot find Vote" });
    } else if (!vote) {
      vote = new Vote();
      vote.user = user;
      vote.value = value;

      if (comment) vote.comment = comment;
      else vote.post = post;

      await vote.save();
    } else if (value === 0) {
      // vote is avaliable but value is 0 reset vote DB
      await vote.remove();
    } else if (vote.value !== value) {
      //if vote and value data s are changed update to vote
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail({
      where: {
        identifier,
        slug,
      },
      relations: ["comments", "comments.votes", "sub", "votes"],
    });

    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const router = Router();
router.post("/", userMiddleware, authMiddleware, vote);
export default router;

import { Comment, Post } from "@/src/types";
import Axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, Fragment, useState } from "react";
import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentAlt,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "@/src/context/auth";
import classNames from "classnames";

const PostPage = () => {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { authenticated, user } = useAuthState();
  const [newComment, setNewcomment] = useState("");

  const fetcher = async (url: string) => {
    try {
      const res = await Axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const {
    data: post,
    error,
    mutate: postMutate,
  } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null,
    fetcher
  );

  const { data: comments, mutate: commentsMutate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null,
    fetcher
  );

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;

    try {
      await Axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
        body: newComment,
      });

      commentsMutate();
      setNewcomment("");
    } catch (error) {
      console.log(error);
    }
  };

  const vote = async (value: number, comment?: Comment) => {
    // if not SignIn status push to SingIn page
    if (!authenticated) router.push("/login");

    // if pressed liked or hate again reset this value
    if (
      (!comment && value === post?.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0;

    try {
      await Axios.post("/votes", {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });
      postMutate();
      commentsMutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">
        <div className="bg-white rounded">
          {post && (
            <Fragment>
              <div className="flex">
                {/* liked part */}
                <div className="flex-shring-0 w-10 py-2 text-center rounded-l">
                  <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    onClick={() => vote(1)}
                  >
                    <i
                      className={classNames({
                        "text-red-500": post.userVote === 1,
                      })}
                    >
                      <FontAwesomeIcon icon={faArrowUp} />
                    </i>
                  </div>
                  <p className="text-xs font-bold">{post.voteScore}</p>
                  <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                    onClick={() => vote(-1)}
                  >
                    <i
                      className={classNames({
                        "text-blue-500": post.userVote === -1,
                      })}
                    >
                      <FontAwesomeIcon icon={faArrowDown} />
                    </i>
                  </div>
                </div>
                <div className="py-2 pr-2 ">
                  <div className="flex items-center">
                    <p className="text-xs text-gray-400">
                      Posted by
                      <Link href={`u/${post.username}`} legacyBehavior>
                        <a className="mx-2 hover:underline">{post.username}</a>
                      </Link>
                      <Link href={post.url} legacyBehavior>
                        <a className="mx-1 hover:underline">
                          {dayjs(post.createdAt).format("YYYY-MM-DD HH:MM")}
                        </a>
                      </Link>
                    </p>
                  </div>
                  <h1 className="my-1 text-xl fone-medium">{post.title}</h1>
                  <p className="my-3 text-sm">{post.body}</p>
                  <div className="flex">
                    <button>
                      <i className="mr-1 ">
                        <FontAwesomeIcon icon={faCommentAlt} />
                      </i>
                      <span className="font-bold ">
                        {post.commentCount} Comments
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {/* Add comment container */}
                <div className="pr-6 mb-4 pl-9 pb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        <Link href={`/u/${user?.username}`} legacyBehavior>
                          <a className="font-semibold text-blue-500">
                            {user?.username}
                          </a>
                        </Link>{" "}
                        Points a Comment
                      </p>
                      <form onClick={submitComment}>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                          onChange={(e) => setNewcomment(e.target.value)}
                          value={newComment}
                        ></textarea>
                        <div className="flex justify-end">
                          <button
                            className="px-3 py-1 text-white bg-gray-400 rounded"
                            disabled={newComment.trim() === ""}
                          >
                            Add Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                      <p className="font-semibold text-gray-400">
                        Sign In for Add Comment
                      </p>
                      <div>
                        <Link href={`/login`} legacyBehavior>
                          <a className="px-3 py-1 text-whtie bg-gray-400 rounded">
                            SIGN IN
                          </a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Comments List Container */}
              {comments?.map((comment) => (
                <div className="flex" key={comment.identifier}>
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1, comment)}
                    >
                      <i
                        className={classNames({
                          "text-red-500": comment.userVote === 1,
                        })}
                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </i>
                    </div>
                    <p className="text-xs font-bold">{comment.voteScore}</p>
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                      onClick={() => vote(-1, comment)}
                    >
                      <i
                        className={classNames({
                          "text-blue-500": comment.userVote === -1,
                        })}
                      >
                        <FontAwesomeIcon icon={faArrowDown} />
                      </i>
                    </div>
                  </div>
                  <div className="py-2 pr-2">
                    <p className="mb-1 text-xs leading-none">
                      <Link href={`/u/${comment.username}`} legacyBehavior>
                        <a className="mr-1 font-bold hover:underline">
                          {comment.username}
                        </a>
                      </Link>
                      <span className="text-gray-600">
                        {`
                        ${comment.voteScore}
                        posts
                        ${dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                        `}
                      </span>
                    </p>
                    <p>{comment.body}</p>
                  </div>
                </div>
              ))}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;

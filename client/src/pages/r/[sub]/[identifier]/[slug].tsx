import { Post } from "@/src/types";
import Axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, Fragment, useState } from "react";
import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "@/src/context/auth";

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

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null,
    fetcher
  );

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;

    try {
      await Axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
        body: newComment,
      });

      setNewcomment("");
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
                <div className=" pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        <Link href={`/u/${user?.username}`} legacyBehavior>
                          <a className="font-semibold text-blue-500">
                            {user?.username}
                          </a>
                        </Link>{" "}
                        Post a Comment
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
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;

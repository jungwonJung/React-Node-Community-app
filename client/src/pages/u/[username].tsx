import PostCards from "@/src/components/PostCards";
import { Comment, Post } from "@/src/types";
import Axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";

const UserPage = () => {
  const fetcher = async (url: string) =>
    await Axios.get(url).then((res) => res.data);
  const router = useRouter();
  const username = router.query.username;

  const { data, error } = useSWR<any>(
    username ? `/users/${username}` : null,
    fetcher
  );

  if (!data) return null;

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* user post and comment history */}
      <div className="w-full md:mr-3 md:w-8/12">
        {data.userData.map((data: any) => {
          if (data.type === "Post") {
            const post: Post = data;
            return <PostCards key={post.identifier} post={post} />;
          } else {
            const comment: Comment = data;
            return (
              <div
                key={comment.identifier}
                className="flex my-4 bg-white rounded"
              >
                <div className="flex-shrink-0 w-10 py-10 text-center bg-white border-r rounded-l ">
                  <i className="text-gray-500 ">
                    <FontAwesomeIcon icon={faCommentAlt} />
                  </i>
                </div>
                <div className="w-full p-2">
                  <p className="mb-2 text-xs texxt-gray-500">
                    <Link href={`/u/${comment.username}`} legacyBehavior>
                      <a className="cursor-pointer hover:underline">
                        {comment.username}
                      </a>
                    </Link>{" "}
                    <span>Commented On</span>
                    <Link href={`/u${comment.post?.url}`} legacyBehavior>
                      <a className="cursor-pointer font-semibold hover:underline">
                        {comment.post?.title}
                      </a>
                    </Link>{" "}
                    <span>•</span>
                    <Link href={`/u/${comment.post?.subName}`} legacyBehavior>
                      <a className="cursor-pointer text-black hover:underline">
                        {comment.post?.subName}
                      </a>
                    </Link>{" "}
                  </p>
                  <hr />
                  <p className="p-1">{comment.body}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      {/* user Info */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="flex items-center p-3 bg-gray-400 rounded-t">
          <Image
            src="https://www.gravatar.com/avatar/?d=mp&f=y"
            alt="user profile"
            className="mx-auto border border-white rounded-full"
            width={40}
            height={40}
          />
          <p className="pl-2 text-md ">{data.user.username}</p>
        </div>
        <div className="p-2 bg-white rounded-b">
          <p>{dayjs(data.user.createdAt).format("YYYY.DD.MM")}SIGN UP</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;

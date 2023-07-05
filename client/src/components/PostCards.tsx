import React from "react";
import { Post } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useAuthState } from "../context/auth";
import { useRouter } from "next/router";
import Axios from "axios";

interface PostCardProps {
  post: Post;
  subMutate: () => void;
}

const PostCards = ({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  },
  subMutate,
}: PostCardProps) => {
  const { authenticated } = useAuthState();
  const router = useRouter();
  const isInSubPage = router.pathname === `/r/[sub]`;
  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");

    if (value === userVote) value = 0;

    try {
      await Axios.post("/votes", {
        identifier,
        slug,
        value,
      });
      if (subMutate) {
        subMutate();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex mb-4 bg-white rounded" id={identifier}>
      <div className="flex-shring-0 w-10 py-2 text-center rounded-l">
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classNames({
              "text-red-500": userVote === 1,
            })}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          <i
            className={classNames({
              "text-blue-500": userVote === -1,
            })}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </i>
        </div>
      </div>
      {/* posts data container */}
      <div className="w-full p-2">
        {!isInSubPage && (
          <div className="flex items-center">
            <Link href={`/r/${subName}`}>
              {sub && (
                <Image
                  src={sub.imageUrl}
                  alt="subImage"
                  className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                  width={12}
                  height={12}
                />
              )}
            </Link>
            <Link href={`/r/${subName}`} legacyBehavior>
              <a className="ml-2 text-xs font-bold cursor-pointer hover:underline">
                {subName}
              </a>
            </Link>
            <span className="mx-1 text-xs text-gray-400">•</span>
          </div>
        )}

        <p className="text-xs text-gray-400">
          Posted by
          <Link href={`/r/${username}`} legacyBehavior>
            <a className="mx-1 hover:underline">{username}</a>
          </Link>
          <Link href={url}>
            <span className="mx-1 hover:underline">
              {dayjs(createdAt).format("YYYY-DD-MM HH:mm")}
            </span>
          </Link>
        </p>

        <Link href={url} legacyBehavior>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={url} passHref>
            <div>
              <i className="mr-1 ">
                <FontAwesomeIcon icon={faCommentAlt} />
              </i>
              <span>{commentCount}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCards;

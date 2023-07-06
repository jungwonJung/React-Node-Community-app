import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import Axios from "axios";
import useSWR from "swr";
import { Post, Sub } from "../types";
import Image from "next/image";
import { useAuthState } from "../context/auth";
import useSWRInfinite from "swr/infinite";
import PostCards from "../components/PostCards";

const Home: NextPage = () => {
  const fetcher = async (url: string) =>
    await Axios.get(url).then((res) => res.data);
  const address = "http://localhost:4000/api/subs/sub/topSubs";

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null;

    return `/posts?page=${pageIndex}`;
  };

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinite<Post[]>(getKey, fetcher);

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);

  const { authenticated } = useAuthState();

  const [observedPost, setObservedPost] = useState("");

  useEffect(() => {
    //if dont have any posts just return
    if (!posts || posts.length === 0) return;
    //get last post id from posts array
    const id = posts[posts.length - 1].identifier;
    // if other post 's add in posts array and definetly changed last post id
    // set last post t0 observedPost
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);
  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    // check croosing poing between Browser Viewport with set up Element
    const observer = new IntersectionObserver(
      // entries from IntersectionObserverEntry s instance array
      (entries) => {
        // isIntersecting : Observe target s crossing condition (Boolean)
        if (entries[0].isIntersecting === true) {
          console.log("Reaching to last Post");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    // start observing about element
    observer.observe(element);
  };

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* post list */}
      <div className="w-full md:mr-3 md:w-8/12">
        {isInitialLoading && (
          <p className="text-lg text-center">IsLoading...</p>
        )}
        {posts?.map((post) => (
          <PostCards key={post.identifier} post={post} mutate={mutate} />
        ))}
      </div>
      {/* sidebar sub-community list */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-center">Top Community</p>
          </div>
          <div>
            {topSubs?.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center px-4 text-s border-b p-3"
              >
                <Link href={`/r/${sub.name}`} legacyBehavior>
                  <a>
                    <Image
                      src={sub.imageUrl}
                      className="rounded-full cursor-pointer"
                      alt="sub"
                      width={24}
                      height={24}
                    />
                  </a>
                </Link>
                <Link href={`/r/${sub.name}`} legacyBehavior>
                  <a className="ml-2 font-bold hover:cursor-pointer">
                    {/* /r/{sub.name} */}
                    {sub.name}
                  </a>
                </Link>
                <p className="ml-auto font-md">{sub.postCount}</p>
              </div>
            ))}
          </div>
          {authenticated && (
            <div className="w-full py-6 text-center">
              <Link href="/subs/create" legacyBehavior>
                <a className="w-full p-2 text-center text-white bg-gray-400 rounded">
                  Create Community
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

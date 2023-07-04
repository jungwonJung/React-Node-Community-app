import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import Axios from "axios";
import useSWR from "swr";
import { Sub } from "../types";
import Image from "next/image";
import { useAuthState } from "../context/auth";

const Home: NextPage = () => {
  const fetcher = async (url: string) =>
    await Axios.get(url).then((res) => res.data);
  const address = "http://localhost:4000/api/subs/sub/topSubs";
  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);
  const { authenticated } = useAuthState();
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* post list */}
      <div className="w-full md:mr-3 md:w-8/12"></div>
      {/* sidebar sub-community list */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="bg-white border rounded mt-4">
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

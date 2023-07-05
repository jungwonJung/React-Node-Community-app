import Link from "next/link";
import { useAuthState } from "../context/auth";
import { Sub } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

export default function SideBar({ sub }: { sub: Sub }) {
  const { authenticated } = useAuthState();
  return (
    <div className="hidden w-4/12 ml-3 md:block">
      <div className="bg-white border rounded">
        <div className="p-3 bg-gray-400 rounded-t">
          <p className="font-semibold text-white">About Community</p>
        </div>
        <div className="p-3">
          <p className="mb-3 text-base">{sub?.description}</p>
          <div className="flex mb-3 text-sm font-medium">
            <div className="w-1/2">
              <p>100</p>
              <p>member</p>
            </div>
          </div>
          <p className="my-3">
            <i className="mr-2 ">
              <FontAwesomeIcon icon={faBirthdayCake} />
            </i>
            {dayjs(sub?.createdAt).format("D.MM.YYYY")}
          </p>

          {authenticated && (
            <div className="mx-0 my-2 ">
              <Link href={`/r/${sub.name}/create`} legacyBehavior>
                <a className="w-full p-2 text-s text-white bg-gray-400 rounded">
                  Create New Post
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

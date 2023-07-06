import Link from "next/link";
import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useAuthDispatch, useAuthState } from "../context/auth";
import Axios from "axios";

const NavBar: React.FC = () => {
  const { loading, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();
  const handleSignOut = () => {
    Axios.post("/auth/logout")
      .then(() => {
        dispatch("SIGNOUT");

        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white">
      <span className="text-2xl font-semibold text-gray-400">
        <Link href="/">Jay's Community</Link>
      </span>

      <div className="max-w-3xl mx-auto px-4">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white w-96">
          <i className="pl-4 pr-3 text-gray-400">
            <FontAwesomeIcon icon={faSearch} />
          </i>
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1 bg-transparent rounded focus:outline-none"
          />
        </div>
      </div>

      <div className="flex ">
        {!loading &&
          (authenticated ? (
            <button
              onClick={handleSignOut}
              className="uppercase w-24 p-1 mr-2 text-center text-white bg-gray-400 rounded"
            >
              SIGN OUT
            </button>
          ) : (
            <Fragment>
              <Link href="/login" legacyBehavior>
                <a className="w-20 p-2 mr-2 text-center text-blue-500 border border-blue-500 rounded">
                  SIGN IN
                </a>
              </Link>
              <Link href="/register" legacyBehavior>
                <a className="w-20 p-2  text-center text-white bg-gray-400 rounded">
                  SIGN UP
                </a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default NavBar;

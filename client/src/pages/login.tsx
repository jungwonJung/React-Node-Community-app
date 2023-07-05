import React, { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../context/auth";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  if (authenticated) router.push("/");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // blocked refresh pages

    try {
      const res = await axios.post("/auth/login", {
        username,
        password,
      });
      // after successed SignIn save this user data in Context
      dispatch("SIGNIN", res.data?.user);
      // after successed SignIn move to home
      router.push("/");
    } catch (error: any) {
      console.log("error :", error);
      setErrors(error.response?.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium uppercase">SIGN IN</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Username"
              value={username}
              setValue={setUsername}
              error={errors.username}
            />
            <InputGroup
              type="password"
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />
            <button className="w-full py-2 mb-1 text-sx font-bold text-white uppecase bg-gray-400 border border-gray-400 rounded uppercase">
              SIGN IN
            </button>
          </form>
          <small>
            "Do you need to sign up?"
            <Link href="/register" legacyBehavior>
              <a className="ml-1 text-blue-500 uppercase">SIGN UP</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;

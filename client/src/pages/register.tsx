import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import InputGroup from "../components/inputGroup";
import axios from "axios";
import { useAuthState } from "../context/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const { authenticated } = useAuthState();

  if (authenticated) router.push("/");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // blocked refresh pages

    try {
      // request to backend with user data's
      const res = await axios.post("/auth/register", {
        email,
        username,
        password,
      });
      console.log("res", res);
      router.push("/login");
    } catch (error: any) {
      console.log("error", error);
      setErrors(error.response.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium uppercase">SIGN UP</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              type="email"
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={errors.email}
            />
            <InputGroup
              placeholder="Username"
              value={username}
              setValue={setUsername}
              error={errors.username}
            />
            <InputGroup
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />
            <button className="w-full py-2 mb-1 text-sx font-bold text-white uppecase bg-gray-400 border border-gray-400 rounded uppercase">
              SIGN UP
            </button>
          </form>
          <small>
            Have you already signed up?
            <Link href="/login" legacyBehavior>
              <a className="ml-1 text-blue-500 uppercase">SIGN IN</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;

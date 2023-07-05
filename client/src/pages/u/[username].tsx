import Axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const UserPage = () => {
  const fetcher = async (url: string) =>
    await Axios.get(url).then((res) => res.data);
  const router = useRouter();
  const username = router.query.username;

  const { data, error } = useSWR<any>(
    username ? `/users/${username}` : null,
    fetcher
  );
  return <div></div>;
};

export default UserPage;

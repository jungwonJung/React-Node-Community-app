import { useAuthState } from "@/src/context/auth";
import Axios from "axios";
import { headers } from "next/dist/client/components/headers";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR from "swr";

const SubPage = () => {
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthState();

  const fetcher = async (url: string) => {
    try {
      const res = await Axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const subName = router.query.sub;
  const { data: sub, error } = useSWR(
    subName ? `/subs/${subName}` : null,
    fetcher
  );

  console.log(sub);

  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current!.name);

    try {
      await Axios.post(`/subs/${sub.name}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  return (
    <Fragment>
      {sub && (
        <Fragment>
          <div>
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImage}
            />
            {/* banner image */}
            <div className="bg-gray-400 hover:cursor-pointer">
              {sub.bannerUrl ? (
                <div
                  className="h-56"
                  style={{
                    backgroundImage: `ur;(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => openFileInput("banner")}
                ></div>
              ) : (
                <div
                  className="h-20 bg-gray-400 hover:cursor-pointer"
                  onClick={() => openFileInput("banner")}
                ></div>
              )}
            </div>
            {/* community meta data s  */}
            <div className="h-20 bg-white">
              <div className="relative flex max-w-5xl px-5 mx-auto">
                <div className="absolute" style={{ top: -15 }}>
                  {sub.imageUrl && (
                    <Image
                      src={sub.imageUrl}
                      alt="sub-community-image"
                      width={70}
                      height={70}
                      className="rounded-full hover:cursor-pointer"
                      onClick={() => openFileInput("image")}
                    />
                  )}
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className=" text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-400">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* post with sidebar */}
          <div className="flex max-w-5xl px-4 pt-5 mx-auto"></div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default SubPage;

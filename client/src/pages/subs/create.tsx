import { useRouter } from "next/router";
import InputGroup from "../../components/inputGroup";
import React, { FormEvent, useState } from "react";
import Axios from "axios";

const SubCreate = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await Axios.post("/subs", { name, title, description });

      router.push(`/r/${res.data.name}`);
    } catch (error: any) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96">
        <h1 className="mb-2 text-lg font-medium">Creating a sub-community</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <p className="font-medium">Name</p>
            <p className="mb-2  text-xs text-gray-400">
              Cannot change the community name.
            </p>
            <InputGroup
              placeholder="Name"
              value={name}
              setValue={setName}
              error={errors.name}
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Title</p>
            <p className="mb-2  text-xs text-gray-400">
              The title can be changed at any time
            </p>
            <InputGroup
              placeholder="Title"
              value={title}
              setValue={setTitle}
              error={errors.title}
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Description</p>
            <p className="mb-2  text-xs text-gray-400">
              This is a description for the community
            </p>
            <InputGroup
              placeholder="Description"
              value={description}
              setValue={setDescription}
              error={errors.description}
            />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-1 text-sm font-semibold rounded text-white bg-gray-400 border">
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCreate;

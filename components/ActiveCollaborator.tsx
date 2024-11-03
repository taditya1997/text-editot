import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";
import React from "react";

const ActiveCollborator = () => {
  const others = useOthers();
  const collaborator = others.map((item) => item.info);
  console.log("others",collaborator);
  return (
    <ul className="collaborators-list">
      {collaborator.map((item) => (
        <li key={item.id}>
          <Image
            src={item.avatar}
            alt="avatar"
            height={100}
            width={100}
            className="inline-block size-8 rounded-full ring-2 ring-dark-100"
            style={{
              border: `3px solid ${item.color}`,
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default ActiveCollborator;

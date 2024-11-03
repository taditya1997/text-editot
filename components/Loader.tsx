import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

export default function Loader() {
  return (
    <div className="loader">
      <Image src="/assets/icons/loader.svg"
       alt="loader"
       width={32}
       height={32}
       className="animate-spin" />
    </div>
  );
}

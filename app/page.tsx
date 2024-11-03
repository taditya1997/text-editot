import AddDocument from "@/components/AddDocument";
import { DeleteModal } from "@/components/DeleteModal";
import Header from "@/components/Header";
import Notification from "@/components/Notification";
import { getDocuments } from "@/lib/actions/rooms.actions";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Home() {
  const clerkUser = await currentUser();
  const rooms = await getDocuments(clerkUser.emailAddresses[0]?.emailAddress);
  console.log("clerUser", clerkUser);

  if (!clerkUser) redirect("/sign-in");

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notification/>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {rooms.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All Documents</h3>
            <AddDocument
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="document-ul">
            {rooms.data.map(({ id, metadata, createdAt }) => (
              <li key={id} className="document-list-item">
                <Link
                  href={`/documents/${id}`}
                  className="flex flex-1 items-center gap-4"
                >
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image
                      src="/assets/icons/doc.svg"
                      alt="document-icon"
                      height={40}
                      width={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Created about {dateConverter(createdAt)}</p>
                  </div>
                </Link>
                <DeleteModal roomId={id}/>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="Documents"
            width={40}
            height={40}
          />
        </div>
      )}
    </main>
  );
}

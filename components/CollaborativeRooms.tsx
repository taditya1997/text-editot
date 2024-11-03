"use client";
import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import Header from "./Header";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import ActiveCollborator from "./ActiveCollaborator";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocument } from "@/lib/actions/rooms.actions";
import ShareModal from "./Sharemodal";

const CollaborativeRoomProvider = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [isEditing, setIsEdting] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const containRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLElement>(null);
  console.log("roommetadata", roomMetadata);
  const updateTitle = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsLoading(true);
      try {
        if (documentTitle !== roomMetadata.title) {
          const updateDocuments = await updateDocument(roomId, documentTitle);

          if (updateDocuments) setIsEdting(false);
        }
      } catch (err) {
        console.error("Some Error Occurred", error);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containRef.current &&
        !containRef.current.contains(e.target as Node)
      ) {
        setIsEdting(false);
        updateDocument(roomId, documentTitle);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roomId, documentTitle]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room"></div>
        <Header>
          <div
            className="flex w-fit items-center justify-center gap-2"
            ref={containRef}
          >
            {/* <p className="document-title">Share</p> */}
            {isEditing && !loading ? (
              <Input
                value={documentTitle}
                type="text"
                ref={inputRef}
                placeholder="Enter Title"
                className="document-title-input"
                disabled={!isEditing}
                onChange={(e) => setDocumentTitle(e.target.value)}
                onKeyDown={(e) => updateTitle(e)}
              />
            ) : (
              <p className="document-title">{documentTitle}</p>
            )}
            {currentUserType === "editor" && !isEditing && (
              <Image
                src="/assets/icons/edit.svg"
                alt="Edit-Button"
                height={24}
                width={24}
                className="pointer"
                onClick={() => setIsEdting(true)}
              />
            )}
            {currentUserType !== "editor" && !isEditing && (
              <p className="view-only-tag">View Only</p>
            )}
            {loading && <p className="text-sm text-gray-400">saving...</p>}
          </div>
          <div className="flex w-full flex-1 justify-end gap-2">
            <ActiveCollborator />
            <ShareModal
              roomId={roomId}
              collaborators={users}
              creatorId={roomMetadata.createrId}
              currentUserType={currentUserType}
            />
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </Header>
        <Editor roomId={roomId} currentUserType={currentUserType} />
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoomProvider;

"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import {  getClerkUsers, getDocumentUser } from "@/lib/actions/users.actions";
import { useUser } from "@clerk/nextjs";

export function Provider({ children }: { children: ReactNode }) {

  const {user:clerkUser} = useUser();
  
  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const user = await getClerkUsers({ userIds });
        return user;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const users = await getDocumentUser({
          roomId,
          currentUser: clerkUser?.emailAddresses[0].emailAddress,
          text:text
        });
        return users;
      }}
    >
      <RoomProvider id="my-room">
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

import CollaborativeRoomProvider from "@/components/CollaborativeRooms";
import { getDocument } from "@/lib/actions/rooms.actions";
import { getClerkUsers } from "@/lib/actions/users.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  // ... existing code ...
const usersData = users.map((user: User) => ({
  ...user,
  userType: user?.email 
    ? (room.usersAccesses[user.email]?.includes("room:write") ? "editor" : "viewer")
    : "viewer"  // default fallback if no email
}));
// ... existing code ...

  const currentUserType = room.usersAccesses[
    clerkUser.emailAddresses[0].emailAddress
  ]?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoomProvider
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
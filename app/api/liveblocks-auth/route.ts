import liveblocks from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  // Get the current user from your database

  const clerkUser = await currentUser();


  if (!currentUser) redirect("/sign-in");

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

//   const user = __getUserFromDB__(request);

  // Identify the user and return the result

  const user={
    id,
    info:{
        id,
        name:`${firstName} ${lastName}`,
        email:emailAddresses[0].emailAddress,
        avatar:imageUrl,
        color:getUserColor(id)

    }
  }
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds:[], // Optional
    },
    { userInfo: user.info }
  );

  return new Response(body, { status });
}
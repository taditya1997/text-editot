import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret:
    process.env.LIVE_BLOCKS_SECRET as string,
});

export default liveblocks;

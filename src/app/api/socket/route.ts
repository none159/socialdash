import { Server, Socket } from "socket.io";
import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

interface OnlineUser {
  userId: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

io.on("connection", (socket: Socket) => {
  console.log("connection", socket.id);

  socket.on("addNewUser", async () => {
    const session = cookies().get("session")?.value;
    const secretkey = process.env.SECRETKEY as string;
    const key = new TextEncoder().encode(secretkey);

    try {
      const { payload } = await jwtVerify(session!, key, {
        algorithms: ["HS256"],
      }) as { payload: JWTPayload & { User: { username: string } } };

      const { username } = payload.User;

      if (!onlineUsers.some((user) => user.userId === username)) {
        onlineUsers.push({
          userId: username,
          socketId: socket.id,
        });
        console.log("onlineUsers", onlineUsers);
      }
    } catch (error) {
      console.error("Error verifying JWT:", error);
    }
  });
});

"use server";
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

// because we want to do server actions

// just a quick note: if an env has PUBLIC in its name it means that it is exposed to the client side where as if it has secret in it, it means that it is at server side (for security reasons)
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not logged in");
  if (!apiKey) throw new Error("No API Key");
  if (!apiSecret) throw new Error("No API Secret");

  // the stream client package is coming from the Node SDK instead of video-react-sdk because we are on the server side
  const client = new StreamClient(apiKey, apiSecret);

  // exp as in expiration (in this case the token will expired in one hour)
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

  // once we have the client and the expiration, we also have to figure out when the token was issued
  const issued = Math.floor(Date.now() / 1000) - 60;

  // creating the token
  const token = client.createToken(user.id, exp, issued);

  return token;
};

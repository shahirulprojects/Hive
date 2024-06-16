"use client";
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

// every provider needs to return its children hence why we always do it like this
const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  // useState of a type streamvideoclient
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  // get information of the currently logged in clerk user
  const { user, isLoaded } = useUser();

  // create the stream user directly from our currently logged in Clerk user
  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!apiKey) throw new Error("Stream API Key missing");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id, // coming from clerk
        name: user?.username || user?.id, // coming from clerk
        image: user?.imageUrl, // coming from clerk
      },
      // tokenProvider so that the app knows that the user is indeed is THAT user
      // the tokens provide a way to authenticate a user or give access to a specific set of video/audio calls.
      tokenProvider,
    });

    setVideoClient(client);
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />; // we put this loader option because at the start, before the useEffect loads, the  <StreamVideo client={videoClient}> will try to get the client but it is not there yet. So we have to do a loader option to avoid the undefined error
  return (
    // similar to what we did with clerk provider where we wrap our whole app with its provider, we also have to wrap our app using the stream video provider
    <StreamVideo client={videoClient}>{children}</StreamVideo>
  );
};

export default StreamVideoProvider;

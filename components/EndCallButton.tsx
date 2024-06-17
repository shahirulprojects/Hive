"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

const EndCallButton = () => {
  const router = useRouter();
  // get access about the information of the call
  const call = useCall();

  const { useLocalParticipant } = useCallStateHooks(); // get the participants of the call
  const localParticipant = useLocalParticipant();

  // check if the user that click the button is the owner of the call
  const isMeetingOwner =
    localParticipant && // if the localParticipant exists then
    call?.state.createdBy && // check the call state created by (check if the meeting was created by someone). if the call?.state.createdBy exists then
    localParticipant.userId === call.state.createdBy.id; // check if the call participant id is equal to the id of the creator call

  if (!isMeetingOwner) return null; // if the user that clicked the button is not the owner than the button will not do anything

  return (
    <Button
      onClick={async () => {
        await call.endCall();

        router.push("/");
      }}
      className="bg-red-500"
    >
      End call for everyone
    </Button>
  );
};

export default EndCallButton;

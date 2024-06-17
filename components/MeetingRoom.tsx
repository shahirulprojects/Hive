"use client";
import { cn } from "@/lib/utils";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";

// types of layout available
type CallLayoutType = "grid" | "speaker-left" | "speaker-right";
const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  // to see if the url contains the word "personal" (indicating that the room is a private room)
  // do note that the private room is DIFFERENT from the call that a user created. The call that the user created is a public room where anyone can have access to end the call for everyone
  // the !! is to convert the truthy value of getting the "personal" word to a real boolean true
  // here is how it works:
  // "personal"=>!"personal=>false=>!false=>true"

  const [layout, setLayout] = useState<CallLayoutType>("speaker-left"); // meaning that the speaker will appear on the left side
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  // render a specific layout depending on the current layout state
  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          {/* render layout component where it depends on what layout do the user chooses */}
          <CallLayout />
        </div>
        {/* render all the participants */}
        {/* will apply the show-block style if the showParticipant is true */}
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          {/* we can also choose not to show the participants by doing the onClose function */}
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call control */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              {/* layout list coming from lucide-react */}
              {/* Lucide React is a collection of React components that provide access to Lucide icons. Lucide itself is an open-source icon library, a fork of Feather Icons, designed to offer a comprehensive set of icons that are consistent, minimal, and customizable. */}
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {/* mapping over the layout types for the dropdown content */}
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-[#4c535b]"
                  onClick={() => {
                    setLayout(item.toLowerCase() as CallLayoutType); // .toLowerCase() since we are naming our layout type in capslock andb as CallLayoutType since the setLayout state can only be type of CallLayoutType
                  }}
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* to see the latency of the call */}
        <CallStatsButton />
        {/* button that will allow  us to see or hide all the participants */}
        {/* setShowParticipants that accepts the previous state and turn it into opposite of that state (on / off basically) */}
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            {/* users icon coming from lucide react */}
            <Users size={20} className="text-white" />
          </div>
        </button>
        {/* // do note that the private room is DIFFERENT from the call that a user created. The call that the user created is a public room where anyone can have access to end the call for everyone */}
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;

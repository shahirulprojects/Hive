"use client";

import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

// setIsSetupComplete of a type setIsSetupComplete that accepts a value of a type boolean and then return void
const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  // check whether the mic and cam is toggled on
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);

  // accessing the call
  // since at the app>root>meeting>id file we have wrapped this meeting setup component with the streamCall component and that streamCall component knows which call we are at, we can now just easily use the useCall function to access the call too
  // this call contains access to the camera and the microphone
  const call = useCall();

  if (!call) {
    throw new Error("useCall must be used within StreamCall component");
  }

  useEffect(() => {
    // if mic and cam is on, we can have the option to disable it, vice versa
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      {/* Stream video component */}
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)} //if the mic and cam are on, it will turn them off. Vice versa
          />
          Join with mic and camera off
        </label>
        {/* ability to change devices for the setup */}
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;

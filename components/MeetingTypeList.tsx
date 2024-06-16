"use client";

import { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";

const MeetingTypeList = () => {
  const router = useRouter();
  // define the possible types of the states / what the state could possibly be
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();

  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  // useState of a type Call
  const [callDetails, setCallDetails] = useState<Call>();

  // toast message
  const { toast } = useToast();

  // usually when we do try and catch, the function must be async
  const createMeeting = async () => {
    if (!client || !user) return; // exit out of the function if there is no client or user

    try {
      // if the user does not select a date and a time for a schedule meeting
      if (!values.dateTime) {
        toast({
          title: "Please select a date and a time",
        });
        return;
      }

      // generate a random id for the call
      // long ago, we have to use a library to generate the random id but now we can just do it like this:
      const id = crypto.randomUUID();

      // create a call
      const call = client.call("default", id); // set the call type to default

      if (!call) throw new Error("Failed to create call");

      // if we succeed, get the time that the call / meeting starts at
      // toISOString() will give us the string of that date time
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      // get the description for the call
      const description = values.description || "Instant meeting";

      // get or create the call (depending if it already exist or we need to create it)
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      // save the call details
      setCallDetails(call);

      // this implies that it is an instant meeting
      // the absence of a description indicates that the user wants to start the meeting immediately without any additional details
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting successfully created",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
      });
    }
  };
  return (
    // grid-cols- means that how many grid that will be shown in a row. If grid-cols-4, than it means that it will show 4 grid in a row (4 columns in a row)
    <section className="grid grid-cols-1 gap-[100px] md:grid-cols-2 xl:grid-cols-4 ">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"} // isOpen is true if the meetingState is isInstantMeeting
        onClose={() => setMeetingState(undefined)} // set the meeting state to undefined to reset it
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;

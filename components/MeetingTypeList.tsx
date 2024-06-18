"use client";

import { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";

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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

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

      {/* check if there is a call details (meaning that if there already exist a scheduled meeting). If it does not exist, we can create a scheduled meeting, if it exists, we can copy the scheduled meeting link */}
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"} // isOpen is true if the meetingState is isScheduleMeeting
          onClose={() => setMeetingState(undefined)} // set the meeting state to undefined to reset it
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value }); // spread the values and modify the description to be event.target.value
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              // do note that this package also needs its corresponding css file (can see the import at app>layout.tsx). This is true for some of the packages like the stream video package
              selected={values.dateTime} // on default, it will preselected the current date and time
              onChange={(date) => setValues({ ...values, dateTime: date! })} // change the date and time according to our preferences
              showTimeSelect // show time to choose
              timeFormat="HH : mm" // format the time
              timeIntervals={15} // intervals between each time
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa" // format the date
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"} // isOpen is true if the meetingState is isScheduleMeeting
          onClose={() => setMeetingState(undefined)} // set the meeting state to undefined to reset it
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            // the ability to copy the meeting link
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link copied" });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}
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

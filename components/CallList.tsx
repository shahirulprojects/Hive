// @ts-nocheck
// to ignore the typscript error for the entire file as we dont want to write "as Call" everytime at line 62

"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";

// type prop that is a type of "type" which can be ended or upcoming or recordings
const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const router = useRouter(); // finding out at which page we are on to figure out which types of calls to fetch
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const { toast } = useToast();

  // return the type of calls based on its type
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;

      default:
        return [];
    }
  };

  // if there are no calls available for the type of call
  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recordings":
        return "No Recordings";
      case "upcoming":
        return "No Upcoming Calls";

      default:
        return "";
    }
  };

  // get recordings from each meeting
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        // get access to the meeting that the user was in
        // Promise.all to fetch multiple things at the same time. In thi case try to get multiple recordings from all of the calls at the same time
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings()) // will give the recordings for each one of our meeting
        );

        // extract the recordings
        const recordings = callData
          .filter((call) => call.recordings.length > 0) // ensuring that it actually has any recordings attach to it
          .flatMap((call) => call.recordings); // return the recordings from each call
        // flatMap is used when there are arrays within an array like [[a,b],[c,d],e,f]. flatMap will combine it into one array like this [a,b,c,d,e,f]

        setRecordings(recordings);
      } catch (error) {
        toast({ title: "Try again later" }); // because sometimes we will get error saying that too many requests at the same time (due to the Promise.all)
      }
    };
    if (type === "recordings") fetchRecordings();
  }, [type, callRecordings]);

  const calls = getCalls(); // to get the exact type of calls that we want so that we dont have to do mapping for each type of calls separately
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {/* if the calls exists then map meeting of a type Call or of a type CallRecording (which both coming from react video sdk) */}
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id} // do it like this because if we do {meeting?.id} it will say that id does not exists on type Call
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom.description.substring(0, 30) ||
              meeting.filename.substring(0, 30) ||
              "No Description"
            } // access the meeting the description and cut it to only 30 characters if it is too long, or display the recorded meetings name, or else display no description
            date={
              // format the date and time
              meeting.state?.startsAt.toLocaleString() ||
              meeting.start_time.toLocaleString()
            }
            isPreviousMeeting={type === "ended"} // previous meeting means that the meeting has ended
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined} // undefined in this case means the button will not be displayed
            buttonText={type === "recordings" ? "Play" : "Start"}
            link={
              type === "recordings"
                ? meeting.url // the url for the recordings
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}` // the url for the meeting
            }
            handleClick={
              type === "recordings"
                ? () => router.push(`${meeting.url}`) // go to the recorded call
                : () => router.push(`/meeting/${meeting.id}`) // go to the call
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;

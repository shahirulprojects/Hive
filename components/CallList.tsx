"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MeetingCard from "./MeetingCard";

// type prop that is a type of "type" which can be ended or upcoming or recordings
const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const router = useRouter(); // finding out at which page we are on to figure out which types of calls to fetch
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

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

  const calls = getCalls(); // to get the exact type of calls that we want so that we dont have to do mapping for each type of calls separately
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {/* if the calls exists then map meeting of a type Call or of a type CallRecording (which both coming from react video sdk) */}
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => <MeetingCard />)
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;

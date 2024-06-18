import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // getting the calls
  const client = useStreamVideoClient();

  // getting the users
  const { user } = useUser();

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;

      setIsLoading(true);

      try {
        // getting the calls for a specific user
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }], // sort it by when the call started (not when the call was created since it can be upcoming calls)
          filter_conditions: {
            starts_at: { $exists: true }, // filter by if the starts_at property exists
            $or: [
              { created_by_user_id: user.id }, // or by if the call is created by the user
              { members: { $in: [user.id] } }, // or if the user is the member of the call
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.id]);

  // since we want to make this custom hook reusable (since theCallList component that use this hook is also a reusable), we can do it like this
  const now = new Date(); // if it is after "now" it is an ended call, if it is after "now" it is an upcoming call

  const endedCalls = calls.filter(({ state: { startsAt, endedAt } }: Call) => {
    // destructure the state and destructure the startsAT and endedAt of a type Call
    return (startsAt && new Date(startsAt) < now) || !!endedAt; // return if the startsAt exists and the newDate of startsAt is before "now" or if the endedAt exists
  });
  const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now; // return if the startsAt exists and the newDate of startsAt is after "now"
  });

  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls, // for the callRecordings it is a bit different from other types of calls, so we will return all of the calls since we will do some filtering. Do note that we didnt declared the callRecordings like we did with endedCalls and upcomingCalls because we already assigned the "call" value to the callRecordings so that it is counted as variable declaration
    isLoading,
  };
};

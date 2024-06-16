// hook is basically just a function that starts with the word "use". So here we just like create a new function

import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

// accept id of a type string or and array of strings
export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  // get access to the stream video client
  const client = useStreamVideoClient();

  // fetching currently active call
  useEffect(() => {
    if (!client) return;

    // why do we declare the loadCall function and then call it within the same useEffect?
    // in useEffect, we cannot directly use async/await because useEffect cannot handle the returned promise.
    // therefore, we declare an async function inside the useEffect and call it to use async/await.
    const loadCall = async () => {
      // query all of the existing calls by querying it by a filter which is id
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id,
        },
      });

      // if calls exist, set the call to the first call (most likely we will only have one call only so thats why we do [0])
      if (calls.length > 0) setCall(calls[0]);

      setIsCallLoading(false);
    };

    loadCall();
  }, [client, id]); // recall the useEffect if the client or the call id changes

  // hook always have to return something
  return { call, isCallLoading };
};

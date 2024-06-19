"use client";
import { useState, useEffect } from "react";
import MeetingTypeList from "@/components/MeetingTypeList";

const Home = () => {
  // specify which country format that we want to get and specify the maximum digit that we want to display (in this case we dont want to show seconds)
  // The locale parameter in the toLocaleTimeString method specifies the format conventions for the output, such as the way time is displayed, the usage of AM/PM, and the ordering of time components.
  // "en-US" specifies American English, where the time format is usually in 12-hour format with AM/PM.
  // "en-GB" specifies British English, where the time format is typically in 24-hour format.
  // Declare state variables for time and date
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      // timeZone: "Asia/Kuala_Lumpur",
    })
  );
  // intl stands for international
  // we use .format because initially it will return the date object but we dont want it in object, so we have to use .format to convert it into string

  const [date, setDate] = useState(
    new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(new Date())
  );

  // useEffect to update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDate(
        new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(now)
      );
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    // size-full will give 100% width and 100% height
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[400px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          {/* <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
            Upcoming Meeting at: 12:30 PM
          </h2> */}
          <div className="flex flex-col gap-2 h-full justify-end">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
      <div className="items-center justify-center mt-20 flex">
        <MeetingTypeList />
      </div>
    </section>
  );
};

export default Home;

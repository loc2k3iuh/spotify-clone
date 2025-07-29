import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import React, { useEffect, useState } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";

const HomePage = () => {
  const [greeting, setGreeting] = useState("");

  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    trendingSongs,
    featuredSongs,
  } = useMusicStore();

  // Function to get current greeting based on time
  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  useEffect(() => {
    // Set initial greeting
    setGreeting(getGreeting());

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  console.log("Song madeForYouSongs: ", {
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  });

  return (
    <main className=" rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-100px)] ">
        <div className="p-4 sm:p-6 ">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            {greeting || "Good Day"}
          </h1>
          <FeaturedSection />
        

        <div className="space-y-8 ">
          <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading} />
          <SectionGrid title="Made For You" songs={trendingSongs} isLoading={isLoading} />
        </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;

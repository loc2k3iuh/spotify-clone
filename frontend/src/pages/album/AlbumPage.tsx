import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";

import { Clock, Play } from "lucide-react";
import React, { use, useEffect } from "react";
import { useParams } from "react-router-dom";


const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();

  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    }
  }, [albumId, fetchAlbumById]);

  if (isLoading) return null;

  return (
    <div className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden ">
      <ScrollArea className=" rounded-md">
        {/* Main Content */}
        <div className="relative min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}

          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8 items-end">
              <div className="relative group">
                <img
                  src={currentAlbum?.imageUrl}
                  alt={currentAlbum?.title}
                  className="w-[240px] h-[240px] shadow-2xl rounded-lg object-cover 
                   transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 rounded-lg bg-black/20 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              <div className="flex flex-col justify-end flex-1 min-h-[240px] pb-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                    Album
                  </p>
                  <h1
                    className="text-4xl md:text-6xl lg:text-7xl font-black text-white 
                       leading-tight max-w-2xl break-words"
                  >
                    {currentAlbum?.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-zinc-200 mt-4">
                    <img
                      src={currentAlbum?.imageUrl}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-semibold text-white hover:underline cursor-pointer">
                      {currentAlbum?.artist}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-300">
                      {currentAlbum?.releaseYear}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-300">
                      {currentAlbum?.songs.length} song
                      {currentAlbum?.songs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all cursor-pointer transition-all"
              >
                <Play className="h-7 w-7 text-black" />
              </Button>
            </div>
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className='px-6'>
                <div className="space-y-2 py-4 ">
                  {currentAlbum?.songs.map((song, index) => (
                    <div
                      key={song._id}
                      className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
                    >
                      <div className="flex items-center justify-center">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play className="h-4 w-4 hidden group-hover:block" />
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="size-10"
                        />
                        <div>
                          <div className={`font-medium text-white`}>
                            {song.title}
                          </div>
                          <div>{song.artist}</div>
                        </div>
                      
                      </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className='flex items-center'>{formatDuration(song.duration)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;

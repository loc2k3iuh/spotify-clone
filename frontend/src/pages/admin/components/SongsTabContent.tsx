import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";
import SongTable from "./SongTable";
import AddSongDialog from "./AddSongDialog";

const SongsTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5 text-emerald-500" />
              Song Library
            </CardTitle>
            <CardDescription>Manage your music tracks</CardDescription>
          </div>
         <AddSongDialog/>
        </div>
      </CardHeader>
      <CardContent>
       <SongTable/>
      </CardContent>
    </Card>
  );
};

export default SongsTabContent;

import  { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";
import React from "react";
import AlbumsTable from "./AlbumsTable";
import AddAlbumDialog from "./AddAlbumDialog";

const AlbumsTabContent = () => {
  return <Card className="bg-amber-800/50 border-zinc-700/50">
    <CardHeader>
      <div className="flex items-center justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          <Library className="h-5 w-5 text-green-500"/>
          Album Library
        </CardTitle>
        <CardDescription>Manage your album collection</CardDescription>
      </div>
      <AddAlbumDialog/>
      </div>
    </CardHeader>

    <CardContent>
      <AlbumsTable />
    </CardContent>
  </Card>;
};

export default AlbumsTabContent;

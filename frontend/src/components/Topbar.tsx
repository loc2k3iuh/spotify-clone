import { SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Music } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";

const Topbar = () => {
  const isAdmin = false; // Replace with actual admin check logic
  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10 border-b border-zinc-800">
      <div className="flex gap-2 items-center">
        <Music className="size-8 text-emerald-500" />
        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
          Spotify
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link 
            to={"/admin"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-medium"
          >
            <LayoutDashboardIcon className="size-4" />
            Admin Dashboard
          </Link>
        )}

        <SignedIn>
          <div className="flex items-center gap-3">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "size-8"
                }
              }}
            />
            <SignOutButton>
              <button className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-medium">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </SignedIn>

        <SignedOut>
          <SignInOAuthButtons/>
        </SignedOut>
      </div>
    </div>
  );
};

export default Topbar;

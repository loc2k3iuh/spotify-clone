import { SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Music } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";

const Topbar = () => {
  const { isAdmin } = useAuthStore(); // Replace with actual admin check logic
  console.log("isAdmin:", isAdmin);
  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10 border-b border-zinc-800">
      <div className="flex gap-2 items-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify Logo" className="h-9" />

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

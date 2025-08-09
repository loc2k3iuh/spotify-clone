import { useEffect, useRef } from "react";
import { Trash2, Copy, Reply } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface MessageContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
  message: any;
}

const MessageContextMenu = ({ x, y, onClose, onDelete, message }: MessageContextMenuProps) => {
  const { user } = useUser();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onClose();
  };

  const handleReply = () => {
    // TODO: Implement reply functionality
    console.log("Reply to message:", message);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  // Check if current user is the sender of the message
  const canDelete = message.senderId === user?.id;

  return (
    <div
      ref={menuRef}
      className="fixed bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-2 z-50 min-w-[160px]"
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="flex flex-col">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
        >
          <Copy className="w-4 h-4" />
          Copy Message
        </button>
        
        <button
          onClick={handleReply}
          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
        >
          <Reply className="w-4 h-4" />
          Reply
        </button>
        
        {/* Only show delete option if user owns the message */}
        {canDelete && (
          <>
            <div className="border-t border-zinc-700 my-1"></div>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete Message
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageContextMenu;
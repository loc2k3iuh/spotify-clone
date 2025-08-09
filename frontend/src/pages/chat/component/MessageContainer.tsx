import { useUser } from "@clerk/clerk-react";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageContextMenu from "./MessageContextMenu";

const MessageContainer = () => {
  const { user } = useUser();
  const { messages, selectedUser, deleteMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    message: any;
  } | null>(null);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scrollToBottom = (smooth = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto"
      });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(isNearBottom);
      
      if (isNearBottom) {
        setShowNewMessageButton(false);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, message: any) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      message,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteMessage = () => {
     if (contextMenu?.message?._id) {
      deleteMessage(contextMenu.message._id);
      setContextMenu(null);
    }
  };

  // Handle new messages
  useEffect(() => {
    if (messages.length > lastMessageCount && lastMessageCount > 0) {
      const lastMessage = messages[messages.length - 1];
      const userSentMessage = lastMessage.senderId === user?.id;
      
      setTimeout(() => {
        if (userSentMessage || isAtBottom) {
          scrollToBottom();
          setShowNewMessageButton(false);
        } else {
          setShowNewMessageButton(true);
        }
      }, 100);
    }
    setLastMessageCount(messages.length);
  }, [messages.length, isAtBottom, user?.id]);

  // Initial scroll when conversation loads
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [selectedUser?.clerkId]);

  const handleNewMessageClick = () => {
    scrollToBottom();
    setShowNewMessageButton(false);
  };

  return (
    <div className="relative h-[calc(100vh-340px)]">
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-custom"
        onScroll={handleScroll}
      >
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message._id} 
              className={`flex items-start gap-3 ${
                message.senderId === user?.id ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="size-8">
                <AvatarImage 
                  src={
                    message.senderId === user?.id 
                      ? user.imageUrl 
                      : selectedUser?.imageUrl
                  }
                />
              </Avatar>
              <div 
                className={`rounded-lg p-3 max-w-[70%] cursor-pointer hover:opacity-90 transition-opacity ${
                  message.senderId === user?.id 
                    ? "bg-green-500" 
                    : "bg-zinc-800"
                }`}
                onContextMenu={(e) => handleContextMenu(e, message)}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-zinc-300 mt-1 block">
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* New Message Button */}
      {showNewMessageButton && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={handleNewMessageClick}
            className="bg-emerald-500 hover:bg-emerald-600 text-black rounded-full px-4 py-2 shadow-lg animate-bounce cursor-pointer"
            size="sm"
          >
            <ChevronDown className="w-4 h-4 mr-1" />
            New message
          </Button>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          message={contextMenu.message}
          onClose={handleCloseContextMenu}
          onDelete={handleDeleteMessage}
        />
      )}
    </div>
  );
};

export default MessageContainer;
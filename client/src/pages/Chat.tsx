import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/context/UserContext"; // Import the user context
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // ShadCN Avatar components
import { ScrollArea } from "@/components/ui/scroll-area"; // ShadCN Scroll Area for smooth scrolling

// Define the message type
interface Message {
  user: string;
  text: string;
  avatar?: string;
}

const Chat: React.FC = () => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);  // Define the type for socket
  const [messages, setMessages] = useState<Message[]>([]);    // Define the type for messages
  const [newMessage, setNewMessage] = useState<string>("");    // Type for the new message

  useEffect(() => {
    // Initialize socket connection
    const socketConnection = io("http://localhost:3000", {
      transports: ["websocket"], // WebSocket transport for better performance
    });

    socketConnection.on("connect", () => {
      console.log("Connected to server");
    });

    // Listen for incoming messages and update the state
    socketConnection.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect(); // Clean up on component unmount
    };
  }, []);

  // Send message handler
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        user: user?.username || "Anonymous", // Dynamically pass the username
        text: newMessage,
        avatar: user?.avatar,
      };
      socket?.emit("message", message); // Send message to backend
      setNewMessage(""); // Clear input
    }
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    sendMessage(); // Call the sendMessage function
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto p-4 border-2 rounded-lg shadow-lg">
      

      {/* Messages Container with ShadCN Scroll Area for smooth scrolling */}
      <ScrollArea className="flex-grow overflow-y-auto p-4  rounded-lg shadow-inner space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Avatar>
              <AvatarImage src={msg.avatar} alt="User Avatar" />
              <AvatarFallback>{msg.user.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{msg.user}</span>
              <span className= "opacity-80">{msg.text}</span>
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Form for Input and Send Button */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-3 mt-4">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 text-lg border-2 focus:outline-none focus:ring-2 "
        />
        <Button
          type="submit"  // Use type="submit" for the button to trigger form submission
          className="bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition duration-300"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default Chat;

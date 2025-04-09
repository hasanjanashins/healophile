
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Send, User, Bot } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBot = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Healophile assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("hello") || input.includes("hi")) {
      return "Hello there! How can I assist you with your healthcare needs today?";
    } else if (
      input.includes("upload") ||
      input.includes("file") ||
      input.includes("document")
    ) {
      return "You can upload your medical files by going to the Files section. We support various formats like PDFs, images, and documents. Your files are securely stored and encrypted.";
    } else if (input.includes("emergency")) {
      return "For emergencies, please visit the Emergency section where you can quickly access emergency services or use the one-tap emergency call button. If this is a life-threatening emergency, please call 911 immediately.";
    } else if (
      input.includes("appointment") ||
      input.includes("doctor") ||
      input.includes("schedule")
    ) {
      return "To schedule an appointment with a doctor, go to the Appointments section. You can select your preferred doctor, date, and time based on availability.";
    } else if (
      input.includes("prescription") ||
      input.includes("medicine") ||
      input.includes("medication")
    ) {
      return "Your prescription records can be found in the Files section under the Documents tab. You can also request prescription refills through the Prescriptions section.";
    } else if (input.includes("thank")) {
      return "You're welcome! I'm happy to help. Is there anything else you'd like to know about Healophile?";
    } else {
      return "I'm here to help with any healthcare questions or assistance navigating the Healophile app. Could you provide more details about what you're looking for?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full border-healophile-blue-light flex flex-col h-[500px]">
      <CardHeader className="py-3">
        <CardTitle className="font-display text-center flex items-center justify-center gap-2">
          <Bot className="h-5 w-5 text-healophile-purple" />
          Healophile Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col h-full pb-0">
        <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className={message.sender === "user" ? "bg-healophile-blue" : "bg-healophile-purple"}>
                  <div className="flex h-full items-center justify-center">
                    {message.sender === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-healophile-blue text-white"
                      : "bg-healophile-purple-light border border-healophile-purple/20"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 max-w-[80%]">
                <Avatar className="bg-healophile-purple">
                  <Bot className="h-5 w-5" />
                </Avatar>
                <div className="rounded-lg px-4 py-3 bg-healophile-purple-light border border-healophile-purple/20">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-healophile-purple animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-healophile-purple animate-pulse delay-150" />
                    <div className="h-2 w-2 rounded-full bg-healophile-purple animate-pulse delay-300" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="py-4 border-t">
          <div className="flex">
            <Input
              type="text"
              placeholder="Ask me anything..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rounded-r-none"
            />
            <Button
              onClick={handleSendMessage}
              className="rounded-l-none bg-gradient-to-r from-healophile-blue to-healophile-purple"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;

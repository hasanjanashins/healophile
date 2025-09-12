
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Send, User, Bot, Mic, MicOff, Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBot = () => {
  const { toast } = useToast();
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputMessage;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);
      
      // Speak the bot response
      speakText(botResponse);
    }, 1000);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Voice Recognition Error",
          description: "Could not start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if (speechSynthesisRef.current && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesisRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not process your voice. Please try again.",
          variant: "destructive",
        });
      };
    }

    // Initialize speech synthesis
    speechSynthesisRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

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
      return "For emergencies, please visit the Emergency section where you can quickly access emergency services, find hospital beds, or get medicines delivered by drone. If this is a life-threatening emergency, please call 911 immediately.";
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
      return "Your prescription records can be found in the Files section under the Documents tab. You can also request prescription refills through the Prescriptions section, or get emergency medicines delivered via drone in the Emergency section.";
    } else if (input.includes("drone") || input.includes("delivery")) {
      return "Our Meds By Drone service in the Emergency section can deliver essential medicines and first aid supplies to your location quickly in emergency situations.";
    } else if (input.includes("bed") || input.includes("hospital")) {
      return "You can check real-time hospital bed availability in the Emergency section. We show available beds across multiple hospitals with booking options.";
    } else if (input.includes("thank")) {
      return "You're welcome! I'm happy to help. Is there anything else you'd like to know about Healophile?";
    } else {
      return "I'm here to help with any healthcare questions or assistance navigating the Healophile app. You can ask me about appointments, emergency services, file uploads, prescriptions, hospital beds, or drone delivery services. What would you like to know?";
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
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask me anything or use voice..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              onClick={isListening ? stopListening : startListening}
              variant="outline"
              className={`px-3 ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
              disabled={isTyping}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={isSpeaking ? stopSpeaking : () => speakText(messages[messages.length - 1]?.text || '')}
              variant="outline"
              className={`px-3 ${isSpeaking ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
              disabled={isTyping || messages.length === 0}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleSendMessage()}
              className="bg-gradient-to-r from-healophile-blue to-healophile-purple px-3"
              disabled={isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {isListening && (
            <div className="mt-2 text-sm text-muted-foreground text-center">
              Listening... Speak now
            </div>
          )}
          {isSpeaking && (
            <div className="mt-2 text-sm text-blue-600 text-center">
              Speaking response...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;

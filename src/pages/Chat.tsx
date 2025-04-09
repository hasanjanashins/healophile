
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-6 text-center">Healophile Assistant</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Got questions about your health, medications, or how to use our app? 
          Our friendly AI assistant is here to help you with personalized guidance.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <ChatBot />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;

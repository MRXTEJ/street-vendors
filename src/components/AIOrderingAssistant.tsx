import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, Send, Bot, User, TrendingUp, Clock, 
  DollarSign, MapPin, Lightbulb, Brain 
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

interface PriceRecommendation {
  item: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  savings: number;
}

const AIOrderingAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "नमस्ते! मैं आपका AI असिस्टेंट हूं। मैं आपको सबसे अच्छे दामों में कच्चा माल ढूंढने में मदद कर सकता हूं। आप क्या चाहते हैं?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        "Find cheapest onions near me",
        "Best price for 5kg tomatoes",
        "Bulk spices supplier",
        "Compare oil prices today"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // AI Price recommendations
  const priceRecommendations: PriceRecommendation[] = [
    {
      item: "Onions",
      currentPrice: 45,
      suggestedPrice: 38,
      reason: "Better price available at nearby supplier",
      savings: 7
    },
    {
      item: "Tomatoes",
      currentPrice: 60,
      suggestedPrice: 52,
      reason: "Wholesale rate for 5kg+ orders",
      savings: 8
    },
    {
      item: "Cooking Oil",
      currentPrice: 180,
      suggestedPrice: 165,
      reason: "Weekend discount available",
      savings: 15
    }
  ];

  // Demand predictions
  const demandPredictions = [
    { item: "Potatoes", trend: "up", change: "+15%", reason: "Festival season approaching" },
    { item: "Green Chilies", trend: "down", change: "-8%", reason: "New harvest season" },
    { item: "Ginger", trend: "up", change: "+12%", reason: "Weather affecting supply" },
  ];

  // Smart suggestions based on common vendor needs
  const smartSuggestions = [
    "Order before 10 AM for same-day delivery",
    "Bulk orders (10kg+) get 5-10% discount",
    "Tuesday-Thursday best prices for vegetables",
    "Combine orders with nearby vendors to reduce delivery cost"
  ];

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    let response = "";
    let suggestions: string[] = [];

    if (input.includes("onion") || input.includes("प्याज")) {
      response = "🧅 मैंने आपके पास के 3 प्याज सप्लायर ढूंढे हैं:\n\n1. राम ट्रेडिंग - ₹38/kg (2km)\n2. श्याम वेजिटेबल्स - ₹42/kg (1.5km)\n3. गुप्ता होलसेल - ₹35/kg (5kg+ ऑर्डर)\n\nसबसे सस्ता: गुप्ता होलसेल (बल्क ऑर्डर के लिए)";
      suggestions = ["Order 5kg onions from Gupta", "Check delivery time", "Compare quality ratings"];
    } else if (input.includes("tomato") || input.includes("टमाटर")) {
      response = "🍅 टमाटर के लिए आज के बेस्ट रेट्स:\n\n• Grade A: ₹52/kg (सुबह 8 बजे तक ऑर्डर करें)\n• Grade B: ₹45/kg\n• बल्क (10kg+): ₹48/kg\n\nसुझाव: Grade A टमाटर लें क्योंकि ग्राहक पसंद करते हैं।";
      suggestions = ["Order Grade A tomatoes", "Check bulk discount", "Set daily reminder"];
    } else if (input.includes("spice") || input.includes("मसाला")) {
      response = "🌶️ मसालों के लिए होलसेल रेट्स:\n\n• हल्दी: ₹180/kg\n• लाल मिर्च: ₹220/kg\n• धनिया: ₹160/kg\n• गरम मसाला: ₹320/kg\n\nकॉम्बो ऑफर: सभी 4 मसाले = ₹850 (₹30 बचत)";
      suggestions = ["Order spice combo", "Check freshness guarantee", "Monthly subscription"];
    } else if (input.includes("best time") || input.includes("कब खरीदें")) {
      response = "⏰ सबसे अच्छा समय:\n\n• सब्जियां: मंगलवार-गुरुवार (सबसे कम रेट)\n• फ्रूट्स: शुक्रवार (फ्रेश स्टॉक)\n• मसाले: महीने की शुरुआत\n• ऑयल: सप्ताहांत (डिस्काउंट)\n\nसुबह 7-10 बजे ऑर्डर करें सेम-डे डिलीवरी के लिए।";
      suggestions = ["Set weekly reminders", "Subscribe to price alerts", "Plan weekly inventory"];
    } else {
      response = "मैं आपकी मदद कर सकता हूं:\n\n• कच्चे माल की कीमतें चेक करना\n• पास के सप्लायर ढूंढना\n• बेस्ट डील्स खोजना\n• ऑर्डर का बेस्ट टाइम बताना\n\nक्या आप कोई स्पेसिफिक चीज़ खोज रहे हैं?";
      suggestions = ["Find cheapest vegetables", "Best suppliers near me", "Today's special offers", "Weekly shopping list"];
    }

    return {
      id: messages.length + 2,
      text: response,
      sender: 'ai',
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* AI Features Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Brain className="w-6 h-6" />
          <span>🤖 AI Smart Ordering Assistant</span>
        </h1>
        <p className="opacity-90">Get intelligent recommendations and find the best deals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>AI Chat Assistant</span>
            </CardTitle>
            <CardDescription>
              Ask me anything about raw material pricing, suppliers, or ordering tips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-3 bg-gray-50 p-4 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && <Bot className="w-4 h-4 mt-1 text-blue-500" />}
                      {message.sender === 'user' && <User className="w-4 h-4 mt-1" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-auto p-1 justify-start"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border shadow-sm p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about prices, suppliers, or ordering tips..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!inputMessage.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <div className="space-y-4">
          {/* Price Optimizer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span>Price Optimizer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {priceRecommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{rec.item}</span>
                    <Badge variant="outline" className="text-green-600">
                      Save ₹{rec.savings}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Current: ₹{rec.currentPrice}</span>
                      <span className="font-semibold text-green-600">Best: ₹{rec.suggestedPrice}</span>
                    </div>
                    <p className="text-xs mt-1">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Demand Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>Demand Prediction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {demandPredictions.map((pred, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div>
                    <span className="font-medium">{pred.item}</span>
                    <p className="text-xs text-gray-600">{pred.reason}</p>
                  </div>
                  <Badge variant={pred.trend === 'up' ? 'destructive' : 'default'}>
                    {pred.change}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Smart Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>Smart Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {smartSuggestions.map((tip, index) => (
                <div key={index} className="p-2 bg-yellow-50 rounded text-sm">
                  💡 {tip}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIOrderingAssistant;
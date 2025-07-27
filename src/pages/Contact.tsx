import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Contact = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: language === 'hi' ? "संदेश भेजा गया!" : "Message sent!",
      description: language === 'hi' 
        ? "हम जल्द ही आपसे संपर्क करेंगे।" 
        : "We'll get back to you soon.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="StreetEats Connect" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">StreetEats Connect</h1>
            </Link>
          </div>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="hidden sm:flex"
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="hidden sm:flex"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'वापस' : 'Back'}
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 mb-4">
              {language === 'hi' ? '📞 संपर्क करें' : '📞 Get in Touch'}
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'hi' ? 'हमसे संपर्क करें' : 'Contact Us'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {language === 'hi' 
                ? 'हमारी टीम आपकी सहायता के लिए तैयार है। कोई भी प्रश्न या सुझाव हो तो बेझिझक संपर्क करें।'
                : 'Our team is here to help you. Feel free to reach out with any questions or suggestions.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-orange-600" />
                    <span>{language === 'hi' ? 'ईमेल' : 'Email'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">support@streeteats.com</p>
                  <p className="text-gray-600 dark:text-gray-300">business@streeteats.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span>{language === 'hi' ? 'फोन' : 'Phone'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">+91 9876543210</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'hi' ? 'सोमवार - शुक्रवार, 9 AM - 6 PM' : 'Monday - Friday, 9 AM - 6 PM'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>{language === 'hi' ? 'पता' : 'Address'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {language === 'hi' 
                      ? 'इंडिया गेट रोड, नई दिल्ली - 110001'
                      : 'India Gate Road, New Delhi - 110001'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-green-500 text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">
                    {language === 'hi' ? '🚀 व्यापारिक पूछताछ' : '🚀 Business Inquiries'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {language === 'hi' 
                      ? 'बड़े ऑर्डर या पार्टनरशिप के लिए विशेष छूट उपलब्ध है।'
                      : 'Special discounts available for bulk orders and partnerships.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi' ? 'संदेश भेजें' : 'Send us a Message'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'hi' 
                      ? 'नीचे दिए गए फॉर्म को भरें और हम 24 घंटे के अंदर जवाब देंगे।'
                      : 'Fill out the form below and we\'ll respond within 24 hours.'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {language === 'hi' ? 'नाम *' : 'Name *'}
                        </label>
                        <Input
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={language === 'hi' ? 'आपका नाम' : 'Your name'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {language === 'hi' ? 'ईमेल *' : 'Email *'}
                        </label>
                        <Input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={language === 'hi' ? 'आपका ईमेल' : 'Your email'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'hi' ? 'विषय *' : 'Subject *'}
                      </label>
                      <Input
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={language === 'hi' ? 'संदेश का विषय' : 'Subject of your message'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'hi' ? 'संदेश *' : 'Message *'}
                      </label>
                      <Textarea
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={language === 'hi' ? 'अपना संदेश यहाँ लिखें...' : 'Write your message here...'}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>{language === 'hi' ? 'भेजा जा रहा...' : 'Sending...'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>{language === 'hi' ? 'संदेश भेजें' : 'Send Message'}</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'hi' ? 'प्लेटफॉर्म कैसे काम करता है?' : 'How does the platform work?'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {language === 'hi' 
                      ? 'हमारा प्लेटफॉर्म स्ट्रीट फूड वेंडर्स को सप्लायर्स से जोड़ता है। आप ऑर्डर कर सकते हैं, पेमेंट कर सकते हैं और रीयल-टाइम में ट्रैक कर सकते हैं।'
                      : 'Our platform connects street food vendors with suppliers. You can place orders, make payments, and track deliveries in real-time.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'hi' ? 'क्या वॉइस ऑर्डरिंग उपलब्ध है?' : 'Is voice ordering available?'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {language === 'hi' 
                      ? 'हाँ! हमारा AI असिस्टेंट आपको हिंदी और अंग्रेजी दोनों में वॉइस से ऑर्डर करने की सुविधा देता है।'
                      : 'Yes! Our AI assistant allows you to place orders using voice commands in both Hindi and English.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'hi' ? 'पेमेंट के क्या विकल्प हैं?' : 'What payment options are available?'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {language === 'hi' 
                      ? 'हम UPI, डेबिट/क्रेडिट कार्ड, नेट बैंकिंग और कैश ऑन डिलीवरी सभी स्वीकार करते हैं।'
                      : 'We accept UPI, debit/credit cards, net banking, and cash on delivery.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'hi' ? 'सप्लायर कैसे बनें?' : 'How to become a supplier?'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {language === 'hi' 
                      ? 'साइन अप करते समय "Supplier" विकल्प चुनें और अपने बिजनेस की जानकारी भरें। हमारी टीम आपको वेरिफाई करेगी।'
                      : 'Choose "Supplier" option during signup and fill in your business details. Our team will verify your account.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
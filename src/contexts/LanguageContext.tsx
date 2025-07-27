import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'app.name': 'Street Vendors',
    'nav.dashboard': 'Dashboard',
    'nav.voice': 'Voice Order',
    'nav.orders': 'Orders',
    'nav.vendors': 'Vendors',
    'nav.profile': 'Profile',
    'nav.team': 'Our Team',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.signout': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullname': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.address': 'Address',
    'auth.shopname': 'Shop Name',
    'auth.accounttype': 'Account Type',
    'auth.customer': 'Customer',
    'auth.vendor': 'Vendor',
    'auth.supplier': 'Supplier',
    'welcome.title': 'Welcome to Street Vendors',
    'welcome.subtitle': 'Get ingredients for your street food business instantly',
    'welcome.description': 'Order fresh ingredients for your street food stall delivered to your location in 30 minutes or less.',
    'welcome.features.voice': 'Voice ordering in Hindi & English',
    'welcome.features.delivery': '30-minute ingredient delivery',
    'welcome.features.vendors': 'Verified ingredient suppliers',
    'welcome.features.rating': 'Rate and review suppliers',
    'dashboard.welcome': 'Welcome Back!',
    'dashboard.subtitle': 'Need ingredients for your street food?',
    'dashboard.voice.start': 'Order Ingredients by Voice',
    'dashboard.quick.access': 'Quick Access',
    'dashboard.quick.subtitle': 'Manage orders and find suppliers',
    'dashboard.view.orders': 'View All Orders',
    'dashboard.find.vendors': 'Find Suppliers',
    'dashboard.features': 'App Features',
    'dashboard.features.subtitle': 'Everything you need for your stall',
    'dashboard.features.voice': 'Voice-enabled ingredient ordering',
    'dashboard.features.tracking': 'Real-time delivery tracking',
    'dashboard.features.matching': 'Supplier matching',
    'dashboard.features.delivery': '30-minute delivery',
    'voice.title': 'Voice Ordering',
    'voice.start': 'Start Recording',
    'voice.stop': 'Stop Recording',
    'voice.processing': 'Processing...',
    'voice.speak': 'Speak your order in Hindi or English',
    'vendors.title': 'Available Ingredient Suppliers',
    'vendors.rating': 'Rating',
    'vendors.delivery': 'Delivery Time',
    'vendors.category': 'Category',
    'vendors.minutes': 'minutes',
    'vendors.view.products': 'View Ingredients',
    'vendors.order.now': 'Order Ingredients',
    'orders.title': 'Your Ingredient Orders',
    'orders.status': 'Status',
    'orders.total': 'Total',
    'orders.date': 'Date',
    'orders.vendor': 'Supplier',
    'orders.rate': 'Rate Supplier',
    'orders.pending': 'Pending',
    'orders.confirmed': 'Confirmed',
    'orders.delivered': 'Delivered',
    'orders.cancelled': 'Cancelled',
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'language.english': 'English',
    'language.hindi': 'हिन्दी',
    'team.title': 'Our Team',
    'team.subtitle': 'Meet the creators behind Street Vendors',
    'landing.hero.title': 'Street Food Ingredients - तुरंत मिले',
    'landing.hero.subtitle': 'Get fresh ingredients for your street food business delivered fast',
    'landing.why.title': 'Why Choose Our Platform?',
    'landing.why.authentic': 'Fresh Quality Ingredients',
    'landing.why.authentic.desc': 'Get fresh vegetables, spices, and cooking supplies from verified suppliers',
    'landing.why.quick': 'Quick 30-Minute Delivery',
    'landing.why.quick.desc': 'Fast delivery of ingredients when you need them most during business hours',
    'landing.why.voice': 'Voice Ordering in Hindi',
    'landing.why.voice.desc': 'Order ingredients in your preferred language - Hindi or English',
    'landing.why.support': 'Support Street Food Business',
    'landing.why.support.desc': 'Help street food vendors get ingredients easily with technology',
    'landing.how.title': 'How It Works',
    'landing.how.step1': 'Find Suppliers',
    'landing.how.step1.desc': 'Browse ingredient suppliers in your area',
    'landing.how.step2': 'Order Ingredients',
    'landing.how.step2.desc': 'Order via voice or browse ingredient catalog',
    'landing.how.step3': 'Quick Delivery',
    'landing.how.step3.desc': 'Get fresh ingredients delivered to your stall',
    'landing.cta': 'Start Ordering Ingredients'
  },
  hi: {
    'app.name': 'स्ट्रीट वेंडर्स',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.voice': 'आवाज़ ऑर्डर',
    'nav.orders': 'ऑर्डर',
    'nav.vendors': 'विक्रेता',
    'nav.profile': 'प्रोफाइल',
    'nav.team': 'हमारी टीम',
    'auth.signin': 'साइन इन',
    'auth.signup': 'साइन अप',
    'auth.signout': 'साइन आउट',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.fullname': 'पूरा नाम',
    'auth.phone': 'फोन नंबर',
    'auth.address': 'पता',
    'auth.shopname': 'दुकान का नाम',
    'auth.accounttype': 'खाता प्रकार',
    'auth.customer': 'ग्राहक',
    'auth.vendor': 'विक्रेता',
    'auth.supplier': 'आपूर्तिकर्ता',
    'welcome.title': 'स्ट्रीट वेंडर्स में आपका स्वागत है',
    'welcome.subtitle': 'अपने स्ट्रीट फूड व्यापार के लिए तुरंत सामग्री पाएं',
    'welcome.description': '30 मिनट या उससे कम समय में अपने स्ट्रीट फूड स्टॉल के लिए ताज़ी सामग्री अपनी लोकेशन पर पहुंचाएं।',
    'welcome.features.voice': 'हिंदी और अंग्रेजी में आवाज़ ऑर्डरिंग',
    'welcome.features.delivery': '30 मिनट सामग्री डिलीवरी',
    'welcome.features.vendors': 'सत्यापित सामग्री आपूर्तिकर्ता',
    'welcome.features.rating': 'आपूर्तिकर्ताओं को रेट और रिव्यू करें',
    'dashboard.welcome': 'वापसी पर स्वागत है!',
    'dashboard.subtitle': 'अपने स्ट्रीट फूड के लिए सामग्री चाहिए?',
    'dashboard.voice.start': 'आवाज़ से सामग्री ऑर्डर करें',
    'dashboard.quick.access': 'त्वरित पहुंच',
    'dashboard.quick.subtitle': 'ऑर्डर प्रबंधित करें और आपूर्तिकर्ता खोजें',
    'dashboard.view.orders': 'सभी ऑर्डर देखें',
    'dashboard.find.vendors': 'आपूर्तिकर्ता खोजें',
    'dashboard.features': 'ऐप की विशेषताएं',
    'dashboard.features.subtitle': 'आपके स्टॉल के लिए सब कुछ चाहिए',
    'dashboard.features.voice': 'आवाज़-सक्षम सामग्री ऑर्डरिंग',
    'dashboard.features.tracking': 'रियल-टाइम डिलीवरी ट्रैकिंग',
    'dashboard.features.matching': 'आपूर्तिकर्ता मैचिंग',
    'dashboard.features.delivery': '30 मिनट डिलीवरी',
    'voice.title': 'आवाज़ ऑर्डरिंग',
    'voice.start': 'रिकॉर्डिंग शुरू करें',
    'voice.stop': 'रिकॉर्डिंग रोकें',
    'voice.processing': 'प्रोसेसिंग...',
    'voice.speak': 'हिंदी या अंग्रेजी में अपना ऑर्डर बोलें',
    'vendors.title': 'उपलब्ध सामग्री आपूर्तिकर्ता',
    'vendors.rating': 'रेटिंग',
    'vendors.delivery': 'डिलीवरी समय',
    'vendors.category': 'श्रेणी',
    'vendors.minutes': 'मिनट',
    'vendors.view.products': 'सामग्री देखें',
    'vendors.order.now': 'सामग्री ऑर्डर करें',
    'orders.title': 'आपके सामग्री ऑर्डर',
    'orders.status': 'स्थिति',
    'orders.total': 'कुल',
    'orders.date': 'दिनांक',
    'orders.vendor': 'आपूर्तिकर्ता',
    'orders.rate': 'आपूर्तिकर्ता रेट करें',
    'orders.pending': 'लंबित',
    'orders.confirmed': 'पुष्ट',
    'orders.delivered': 'डिलीवर',
    'orders.cancelled': 'रद्द',
    'profile.title': 'प्रोफाइल',
    'profile.edit': 'प्रोफाइल संपादित करें',
    'profile.save': 'परिवर्तन सहेजें',
    'theme.light': 'हल्का',
    'theme.dark': 'गहरा',
    'language.english': 'English',
    'language.hindi': 'हिन्दी',
    'team.title': 'हमारी टीम',
    'team.subtitle': 'स्ट्रीट वेंडर्स के निर्माताओं से मिलें',
    'landing.hero.title': 'स्ट्रीट फूड सामग्री - तुरंत मिले',
    'landing.hero.subtitle': 'अपने स्ट्रीट फूड व्यापार के लिए ताज़ी सामग्री तेज़ डिलीवरी के साथ पाएं',
    'landing.why.title': 'हमारा प्लेटफॉर्म क्यों चुनें?',
    'landing.why.authentic': 'ताज़ी गुणवत्ता सामग्री',
    'landing.why.authentic.desc': 'सत्यापित आपूर्तिकर्ताओं से ताज़ी सब्जियां, मसाले और खाना पकाने की सामग्री पाएं',
    'landing.why.quick': 'त्वरित 30 मिनट डिलीवरी',
    'landing.why.quick.desc': 'व्यापारिक घंटों के दौरान जब आपको सबसे ज्यादा जरूरत हो, तब सामग्री की तेज़ डिलीवरी',
    'landing.why.voice': 'हिंदी में आवाज़ ऑर्डरिंग',
    'landing.why.voice.desc': 'अपनी पसंदीदा भाषा में सामग्री ऑर्डर करें - हिंदी या अंग्रेजी',
    'landing.why.support': 'स्ट्रीट फूड व्यापार का समर्थन',
    'landing.why.support.desc': 'तकनीक के साथ स्ट्रीट फूड विक्रेताओं को आसानी से सामग्री दिलाने में मदद करें',
    'landing.how.title': 'यह कैसे काम करता है',
    'landing.how.step1': 'आपूर्तिकर्ता खोजें',
    'landing.how.step1.desc': 'अपने क्षेत्र में सामग्री आपूर्तिकर्ताओं को ब्राउज़ करें',
    'landing.how.step2': 'सामग्री ऑर्डर करें',
    'landing.how.step2.desc': 'आवाज़ के माध्यम से या सामग्री कैटलॉग ब्राउज़ करके ऑर्डर करें',
    'landing.how.step3': 'त्वरित डिलीवरी',
    'landing.how.step3.desc': 'अपने स्टॉल पर ताज़ी सामग्री डिलीवर कराएं',
    'landing.cta': 'सामग्री ऑर्डर करना शुरू करें'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'hi'>('en');
  const { toast } = useToast();

  useEffect(() => {
    // Load language preference from user profile
    const loadLanguagePreference = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('language_preference')
            .eq('user_id', user.id)
            .single();
          
          if (profile?.language_preference) {
            setLanguageState(profile.language_preference as 'en' | 'hi');
          }
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };

    loadLanguagePreference();
  }, []);

  const setLanguage = async (lang: 'en' | 'hi') => {
    setLanguageState(lang);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ language_preference: lang })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
      toast({
        title: "Error",
        description: "Failed to save language preference",
        variant: "destructive",
      });
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
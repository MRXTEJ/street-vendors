import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Clock, MapPin, Shield, Zap, Star, Users, TrendingUp, LogIn, Mic, ShoppingCart, Truck, Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import logo from "@/assets/logo.png";
import heroVendor from "@/assets/hero-vendor.jpg";
import heroSupplier from "@/assets/hero-supplier.jpg";
import TeamSection from "./TeamSection";

interface LandingPageProps {
  onAuthRequired: () => void;
}

const LandingPage = ({ onAuthRequired }: LandingPageProps) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt={t('app.name')} className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('app.name')}</h1>
          </div>
          <nav className="flex items-center space-x-2 text-sm font-medium">
            {/* Desktop navigation */}
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
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors hidden md:block">
              {language === 'hi' ? 'विशेषताएं' : 'Features'}
            </a>
            <a href="#team" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors hidden md:block">
              {language === 'hi' ? 'टीम' : 'Team'}
            </a>
            <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors hidden md:block">
              {language === 'hi' ? 'संपर्क' : 'Contact'}
            </a>
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="sm:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    className="justify-start"
                  >
                    {language === 'en' ? 'हिन्दी' : 'English'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="justify-start"
                  >
                    {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                  </Button>
                  <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2">
                    {language === 'hi' ? 'विशेषताएं' : 'Features'}
                  </a>
                  <a href="#team" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2">
                    {language === 'hi' ? 'टीम' : 'Team'}
                  </a>
                  <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2">
                    {language === 'hi' ? 'संपर्क' : 'Contact'}
                  </a>
                  <Button onClick={onAuthRequired} variant="outline" className="justify-start mt-4">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('auth.signin')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Desktop sign in button */}
            <Button onClick={onAuthRequired} variant="outline" size="sm" className="hidden sm:flex">
              <LogIn className="w-4 h-4 mr-2" />
              {t('auth.signin')}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-green-500 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30">
                🇮🇳 {language === 'hi' ? 'भारत में लॉन्च हो रहा है' : 'Launching in India'}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {t('landing.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                {t('landing.hero.subtitle')}
              </p>
              <p className="text-lg opacity-80">
                {t('welcome.description')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4" />
                  <span>{t('welcome.features.voice')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{t('welcome.features.delivery')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>{t('welcome.features.vendors')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>{t('welcome.features.rating')}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8"
                  onClick={onAuthRequired}
                >
                  {t('landing.cta')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 text-lg px-8"
                  onClick={() => document.getElementById('why-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {language === 'hi' ? 'और जानें' : 'Learn More'}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src={heroVendor} 
                    alt="Local vendor"
                    className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300"
                  />
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Mic className="w-5 h-5" />
                        <span className="text-sm">{t('voice.title')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4 pt-8">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm">30 {t('vendors.minutes')} {t('vendors.delivery')}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <img 
                    src={heroSupplier} 
                    alt="Fresh supplies"
                    className="rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-section" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.why.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {language === 'hi' ? 'भारत का पहला स्ट्रीट वेंडर प्लेटफॉर्म' : 'India\'s first comprehensive street vendor platform'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg dark:text-white">{t('landing.why.authentic')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('landing.why.authentic.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg dark:text-white">{t('landing.why.quick')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('landing.why.quick.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg dark:text-white">{t('landing.why.voice')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('landing.why.voice.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg dark:text-white">{t('landing.why.support')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('landing.why.support.desc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.how.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('landing.how.step1')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('landing.how.step1.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('landing.how.step2')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('landing.how.step2.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('landing.how.step3')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('landing.how.step3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-green-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'hi' ? 'अभी शुरू करने के लिए तैयार हैं?' : 'Ready to get started?'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {language === 'hi' ? 'स्थानीय स्ट्रीट वेंडर्स से जुड़ें और तुरंत ऑर्डर करें' : 'Connect with local street vendors and start ordering instantly'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8" onClick={onAuthRequired}>
              {t('landing.cta')}
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team">
        <TeamSection />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={logo} alt={t('app.name')} className="w-6 h-6" />
            <span className="text-lg font-semibold">{t('app.name')}</span>
          </div>
          <p className="text-gray-400">
            {language === 'hi' ? '2024 से स्ट्रीट फूड वेंडर्स को विश्वसनीय आपूर्तिकर्ताओं से जोड़ना' : 'Connecting street food vendors with trusted suppliers since 2024'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
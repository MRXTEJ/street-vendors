import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  role: string;
  shop_name: string;
  address: string;
  account_type: string;
  is_verified: boolean;
  language_preference: string;
  theme_preference: string;
}

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onProfileUpdated: () => void;
}

const ProfileModal = ({ user, onClose, onProfileUpdated }: ProfileModalProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || {
        id: '',
        user_id: user.id,
        full_name: '',
        phone: '',
        role: 'customer',
        shop_name: '',
        address: '',
        account_type: 'customer',
        is_verified: false,
        language_preference: 'en',
        theme_preference: 'light'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        full_name: profile.full_name,
        phone: profile.phone,
        role: profile.role,
        shop_name: profile.shop_name,
        address: profile.address,
        account_type: profile.account_type,
        language_preference: profile.language_preference,
        theme_preference: profile.theme_preference
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      // Update contexts
      setLanguage(profile.language_preference as 'en' | 'hi');
      setTheme(profile.theme_preference as 'light' | 'dark');

      toast({
        title: "Success",
        description: t('profile.save'),
      });

      onProfileUpdated();
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-lg max-w-md w-full p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">{t('profile.title')}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('auth.fullname')}</Label>
              <Input
                id="fullName"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input
                id="phone"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Read-only)</Label>
            <Input
              id="email"
              value={user.email || ''}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">{t('auth.accounttype')}</Label>
            <Select 
              value={profile.account_type} 
              onValueChange={(value) => setProfile({ ...profile, account_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">{t('auth.customer')}</SelectItem>
                <SelectItem value="vendor">{t('auth.vendor')}</SelectItem>
                <SelectItem value="supplier">{t('auth.supplier')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(profile.account_type === 'vendor' || profile.account_type === 'supplier') && (
            <div className="space-y-2">
              <Label htmlFor="shopName">{t('auth.shopname')}</Label>
              <Input
                id="shopName"
                value={profile.shop_name || ''}
                onChange={(e) => setProfile({ ...profile, shop_name: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="address">{t('auth.address')}</Label>
            <Textarea
              id="address"
              value={profile.address || ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={profile.language_preference} 
                onValueChange={(value) => setProfile({ ...profile, language_preference: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('language.english')}</SelectItem>
                  <SelectItem value="hi">{t('language.hindi')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select 
                value={profile.theme_preference} 
                onValueChange={(value) => setProfile({ ...profile, theme_preference: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('theme.light')}</SelectItem>
                  <SelectItem value="dark">{t('theme.dark')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {profile.is_verified && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700 dark:text-green-300">Verified Account</span>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? 'Saving...' : t('profile.save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
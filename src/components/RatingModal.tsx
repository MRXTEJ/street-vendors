import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface RatingModalProps {
  orderId: string;
  vendorId: string;
  vendorName: string;
  onClose: () => void;
  onRatingSubmitted: () => void;
}

const RatingModal = ({ orderId, vendorId, vendorName, onClose, onRatingSubmitted }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please provide an overall rating",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Insert rating
      const { error } = await supabase
        .from('vendor_ratings')
        .insert({
          vendor_id: vendorId,
          user_id: user.id,
          order_id: orderId,
          rating,
          delivery_rating: deliveryRating || null,
          quality_rating: qualityRating || null,
          comment: comment.trim() || null
        });

      if (error) throw error;

      // Update vendor's average rating
      const { data: ratings } = await supabase
        .from('vendor_ratings')
        .select('rating')
        .eq('vendor_id', vendorId);

      if (ratings && ratings.length > 0) {
        const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        
        await supabase
          .from('vendors')
          .update({ 
            rating: Math.round(avgRating * 10) / 10,
            total_ratings: ratings.length 
          })
          .eq('id', vendorId);
      }

      toast({
        title: "Success",
        description: "Thank you for your rating!",
      });

      onRatingSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              i < value 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 hover:text-yellow-200'
            }`}
            onClick={() => onChange(i + 1)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t('orders.rate')} - {vendorName}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>

        <div className="space-y-4">
          <StarRating 
            value={rating} 
            onChange={setRating} 
            label="Overall Rating *" 
          />
          
          <StarRating 
            value={deliveryRating} 
            onChange={setDeliveryRating} 
            label="Delivery Speed" 
          />
          
          <StarRating 
            value={qualityRating} 
            onChange={setQualityRating} 
            label="Product Quality" 
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Comment (Optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || rating === 0}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
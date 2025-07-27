import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceOrderingProps {
  onOrderComplete: (orderData: any) => void;
}

const VoiceOrdering = ({ onOrderComplete }: VoiceOrderingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processAudioOrder(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your order clearly. Click stop when finished.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudioOrder = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64Audio = btoa(String.fromCharCode(...uint8Array));

      // For now, simulate processing - in a real app you'd send this to a speech-to-text service
      setTimeout(() => {
        const mockTranscript = "I need 2 kg onions, 1 kg tomatoes, and 500g green chilies from the nearest supplier";
        setTranscript(mockTranscript);
        
        // Parse the mock order
        const mockOrder = {
          items: [
            { name: "Onions", quantity: "2 kg", price: 40 },
            { name: "Tomatoes", quantity: "1 kg", price: 30 },
            { name: "Green Chilies", quantity: "500g", price: 25 }
          ],
          total: 95,
          isVoiceOrder: true
        };
        
        setIsProcessing(false);
        toast({
          title: "Order processed!",
          description: "Your voice order has been converted and is ready for review.",
        });
        
        onOrderComplete(mockOrder);
      }, 2000);

    } catch (error) {
      console.error('Error processing audio:', error);
      setIsProcessing(false);
      toast({
        title: "Processing failed",
        description: "Unable to process your voice order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-primary">Voice Ordering</CardTitle>
        <CardDescription>
          Speak your order and we'll help you find the right suppliers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {!isRecording && !isProcessing && (
            <Button
              onClick={startRecording}
              size="lg"
              className="w-32 h-32 rounded-full bg-green-500 hover:bg-green-600 text-white"
            >
              <Mic className="w-12 h-12" />
            </Button>
          )}
          
          {isRecording && (
            <Button
              onClick={stopRecording}
              size="lg"
              className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 text-white animate-pulse"
            >
              <MicOff className="w-12 h-12" />
            </Button>
          )}
          
          {isProcessing && (
            <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center animate-spin">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          )}
          
          <p className="text-center text-sm text-muted-foreground">
            {isRecording && "Recording... Speak your order clearly"}
            {isProcessing && "Processing your order..."}
            {!isRecording && !isProcessing && "Tap to start voice ordering"}
          </p>
        </div>
        
        {transcript && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Your Order:</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakText(transcript)}
              >
                <Volume2 className="w-4 h-4 mr-1" />
                Listen
              </Button>
            </div>
            <p className="text-sm bg-muted p-3 rounded-lg">{transcript}</p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground text-center">
          <p>💡 Tip: Speak clearly and mention quantities and items</p>
          <p>Example: "I need 2 kg onions and 1 kg tomatoes"</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceOrdering;
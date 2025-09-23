import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Video, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ProcessingResult {
  processed_video_url: string;
  audio_feedback_url: string;
  description_text: string;
}

const VisionMate = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `Selected: ${file.name}`,
      });
    }
  };

  const simulateProcessing = useCallback(async (file: File): Promise<ProcessingResult> => {
    // Simulate video processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create object URL for the uploaded video
    const videoUrl = URL.createObjectURL(file);
    
    // Simulate zebra crossing detection results
    const detectionResults = [
      "1 zebra crossing detected at intersection",
      "2 zebra crossings found - safe to cross",
      "Clear zebra crossing ahead - proceed with caution",
      "Multiple crossings detected in area",
      "Zebra crossing partially visible - check for traffic"
    ];
    
    const randomResult = detectionResults[Math.floor(Math.random() * detectionResults.length)];
    
    // Create a simple audio feedback (using text-to-speech simulation)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
    
    return {
      processed_video_url: videoUrl,
      audio_feedback_url: '', // We'll use text-to-speech API in production
      description_text: randomResult
    };
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a video file first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await simulateProcessing(selectedFile);
      setResult(result);
      
      // Speak the result using Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(result.description_text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
      
      toast({
        title: "Processing Complete",
        description: "Video analyzed successfully!",
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startLiveRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      setMediaStream(stream);
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
      
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm' 
      });
      
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
        setSelectedFile(file);
        toast({
          title: "Recording Saved",
          description: "Live recording captured successfully!",
        });
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Live video recording in progress...",
      });
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use live recording.",
        variant: "destructive",
      });
    }
  };

  const stopLiveRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
    }
    setIsRecording(false);
    setMediaRecorder(null);
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleAudioMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioMuted;
      setAudioMuted(!audioMuted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4 tracking-wider">
            VISIONMATE
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered assistive technology for safe pedestrian navigation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Section */}
          <Card className="p-8 space-y-6 backdrop-blur-sm bg-card/95 border-primary/20 shadow-lg">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-card-foreground">Upload Video</h2>
              
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 group"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-primary/60 group-hover:text-primary transition-colors" />
                <p className="text-lg font-medium mb-2">Drop file or browse</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported formats: MP4, AVI, MKV, MOV, WEBM
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>

              {selectedFile && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium">Selected: {selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}

              {/* Live Recording */}
              <div className="space-y-3">
                <Button
                  variant={isRecording ? "destructive" : "secondary"}
                  onClick={isRecording ? stopLiveRecording : startLiveRecording}
                  className="w-full"
                  size="lg"
                >
                  <Video className="w-5 h-5 mr-2" />
                  {isRecording ? "Stop Recording" : "Start Live Recording"}
                </Button>
                
                {isRecording && (
                  <video
                    ref={liveVideoRef}
                    autoPlay
                    muted
                    className="w-full rounded-lg border border-primary/20"
                  />
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || isProcessing}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg"
                size="lg"
              >
                {isProcessing ? "Processing..." : "Analyze Video"}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-8 space-y-6 backdrop-blur-sm bg-card/95 border-primary/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-card-foreground">Results</h2>
            
            {/* Video Player */}
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black/10 min-h-[200px] flex items-center justify-center border border-primary/20">
                {result?.processed_video_url ? (
                  <div className="relative w-full">
                    <video
                      ref={videoRef}
                      src={result.processed_video_url}
                      className="w-full rounded-lg"
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      controls
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Processed video will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Feedback */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Audio Feedback</h3>
                {result && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAudioMute}
                  >
                    {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                )}
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg border border-primary/10 min-h-[80px] flex items-center justify-center">
                {result ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Volume2 className="w-5 h-5 text-primary mr-2" />
                      <span className="text-sm text-muted-foreground">Audio generated via Text-to-Speech</span>
                    </div>
                    <audio
                      ref={audioRef}
                      controls
                      className="w-full"
                      muted={audioMuted}
                    >
                      <source src="" type="audio/mpeg" />
                    </audio>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">Audio feedback will be generated after processing</p>
                )}
              </div>
            </div>

            {/* Description */}
            {result?.description_text && (
              <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/30">
                <h3 className="text-lg font-medium mb-3 text-primary">Detection Result</h3>
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  {result.description_text}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center backdrop-blur-sm bg-card/95 border-primary/20">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Advanced YOLO detection for zebra crossings and pedestrian safety
            </p>
          </Card>
          
          <Card className="p-6 text-center backdrop-blur-sm bg-card/95 border-primary/20">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Audio Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Clear voice descriptions of detected crossings and navigation guidance
            </p>
          </Card>
          
          <Card className="p-6 text-center backdrop-blur-sm bg-card/95 border-primary/20">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Multiple Formats</h3>
            <p className="text-sm text-muted-foreground">
              Support for various video formats and live camera recording
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisionMate;
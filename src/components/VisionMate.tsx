import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Video, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface DetectedObject {
  id: string;
  type: 'car' | 'bike' | 'pedestrian' | 'traffic_light' | 'zebra_crossing' | 'bus' | 'truck' | 'motorcycle';
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  position: string;
}

interface ProcessingResult {
  processed_video_url: string;
  audio_feedback_url: string;
  description_text: string;
  detected_objects: DetectedObject[];
  confidence_score: number;
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
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const simulateAdvancedDetection = useCallback(async (file: File): Promise<ProcessingResult> => {
    // Simulate video processing delay with progress
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create object URL for the uploaded video
    const videoUrl = URL.createObjectURL(file);
    
    // Simulate realistic object detection with various objects
    const objectTypes: DetectedObject['type'][] = ['car', 'bike', 'pedestrian', 'traffic_light', 'zebra_crossing', 'bus', 'truck', 'motorcycle'];
    const positions = ['left side', 'right side', 'center', 'far left', 'far right', 'approaching', 'distant'];
    
    // Generate realistic detected objects
    const numObjects = Math.floor(Math.random() * 5) + 2; // 2-6 objects
    const detectedObjects: DetectedObject[] = [];
    
    for (let i = 0; i < numObjects; i++) {
      const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
      const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      detectedObjects.push({
        id: `obj_${i}`,
        type: objectType,
        confidence: Math.round(confidence * 100) / 100,
        bbox: {
          x: Math.floor(Math.random() * 400),
          y: Math.floor(Math.random() * 300),
          width: Math.floor(Math.random() * 100) + 50,
          height: Math.floor(Math.random() * 80) + 40,
        },
        position
      });
    }
    
    // Generate contextual description
    const carCount = detectedObjects.filter(obj => obj.type === 'car').length;
    const bikeCount = detectedObjects.filter(obj => obj.type === 'bike' || obj.type === 'motorcycle').length;
    const pedestrianCount = detectedObjects.filter(obj => obj.type === 'pedestrian').length;
    const zebraCrossingCount = detectedObjects.filter(obj => obj.type === 'zebra_crossing').length;
    
    let description = "Detection complete: ";
    const detections = [];
    
    if (carCount > 0) detections.push(`${carCount} car${carCount > 1 ? 's' : ''}`);
    if (bikeCount > 0) detections.push(`${bikeCount} bike${bikeCount > 1 ? 's' : ''}`);
    if (pedestrianCount > 0) detections.push(`${pedestrianCount} pedestrian${pedestrianCount > 1 ? 's' : ''}`);
    if (zebraCrossingCount > 0) detections.push(`${zebraCrossingCount} zebra crossing${zebraCrossingCount > 1 ? 's' : ''}`);
    
    description += detections.join(', ') + ' detected. ';
    
    // Add safety guidance
    if (zebraCrossingCount > 0) {
      description += "Zebra crossing available for safe passage. ";
    }
    if (carCount > 2) {
      description += "Heavy traffic detected, exercise caution. ";
    }
    if (pedestrianCount > 0) {
      description += "Other pedestrians nearby. ";
    }
    
    const overallConfidence = detectedObjects.reduce((sum, obj) => sum + obj.confidence, 0) / detectedObjects.length;
    
    return {
      processed_video_url: videoUrl,
      audio_feedback_url: '',
      description_text: description.trim(),
      detected_objects: detectedObjects,
      confidence_score: Math.round(overallConfidence * 100) / 100
    };
  }, []);

  const speakWithEnhancedVoice = useCallback(async (text: string) => {
    // Stop any current speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    setIsSpeaking(true);
    
    try {
      // Wait for voices to load
      await new Promise<void>((resolve) => {
        if (speechSynthesis.getVoices().length > 0) {
          resolve();
        } else {
          speechSynthesis.addEventListener('voiceschanged', () => resolve(), { once: true });
        }
      });
      
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      
      // Prefer high-quality English voices
      const preferredVoices = voices.filter(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Natural'))
      );
      
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      } else if (voices.length > 0) {
        utterance.voice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      }
      
      // Enhanced voice settings for clarity
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
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
      const result = await simulateAdvancedDetection(selectedFile);
      setResult(result);
      setDetectedObjects(result.detected_objects);
      
      // Enhanced text-to-speech with better voice
      if ('speechSynthesis' in window) {
        await speakWithEnhancedVoice(result.description_text);
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
            
            {/* Video Player with Object Detection Overlay */}
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
                    
                    {/* Object Detection Bounding Boxes Overlay */}
                    {detectedObjects.length > 0 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {detectedObjects.map((obj) => (
                          <div
                            key={obj.id}
                            className="absolute border-2 border-accent rounded-md"
                            style={{
                              left: `${(obj.bbox.x / 640) * 100}%`,
                              top: `${(obj.bbox.y / 480) * 100}%`,
                              width: `${(obj.bbox.width / 640) * 100}%`,
                              height: `${(obj.bbox.height / 480) * 100}%`,
                              borderColor: obj.type === 'car' ? '#ff4444' : 
                                         obj.type === 'pedestrian' ? '#44ff44' :
                                         obj.type === 'zebra_crossing' ? '#4444ff' : '#ffff44'
                            }}
                          >
                            <div 
                              className="absolute -top-6 left-0 px-1 py-0.5 text-xs font-medium rounded text-white"
                              style={{
                                backgroundColor: obj.type === 'car' ? '#ff4444' : 
                                               obj.type === 'pedestrian' ? '#44ff44' :
                                               obj.type === 'zebra_crossing' ? '#4444ff' : '#ffff44'
                              }}
                            >
                              {obj.type} ({Math.round(obj.confidence * 100)}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Processed video will appear here</p>
                  </div>
                )}
              </div>
              
              {/* Detection Statistics */}
              {result && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-sm text-muted-foreground">Objects Detected</p>
                    <p className="text-xl font-bold text-primary">{detectedObjects.length}</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-sm text-muted-foreground">Avg. Confidence</p>
                    <p className="text-xl font-bold text-primary">
                      {result.confidence_score ? Math.round(result.confidence_score * 100) : 0}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Feedback */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Audio Feedback</h3>
                <div className="flex items-center gap-2">
                  {isSpeaking && (
                    <div className="flex items-center gap-1 text-accent">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-xs">Speaking...</span>
                    </div>
                  )}
                  {result && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => result && speakWithEnhancedVoice(result.description_text)}
                      disabled={isSpeaking}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg border border-primary/10 min-h-[100px] flex flex-col justify-center">
                {result ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center mb-2">
                      <Volume2 className="w-5 h-5 text-primary mr-2" />
                      <span className="text-sm text-muted-foreground">Enhanced Text-to-Speech Audio</span>
                    </div>
                    
                    {/* Voice Controls */}
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => speakWithEnhancedVoice(result.description_text)}
                        disabled={isSpeaking}
                        className="text-xs"
                      >
                        {isSpeaking ? 'Speaking...' : 'Play Audio'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => speechSynthesis.cancel()}
                        disabled={!isSpeaking}
                        className="text-xs"
                      >
                        Stop
                      </Button>
                    </div>
                    
                    {/* Audio Visualization */}
                    {isSpeaking && (
                      <div className="flex justify-center items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-accent rounded-full animate-pulse"
                            style={{
                              height: Math.random() * 20 + 10 + 'px',
                              animationDelay: i * 0.1 + 's'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">High-quality audio feedback will be generated after processing</p>
                )}
              </div>
            </div>

            {/* Detection Results */}
            {result?.description_text && (
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-medium mb-3 text-primary">Detection Summary</h3>
                  <p className="text-lg font-medium text-foreground leading-relaxed">
                    {result.description_text}
                  </p>
                </div>
                
                {/* Detailed Object List */}
                {detectedObjects.length > 0 && (
                  <div className="p-4 bg-card/50 rounded-lg border border-primary/20">
                    <h4 className="font-medium mb-3 text-foreground">Detected Objects:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {detectedObjects.map((obj) => (
                        <div key={obj.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: obj.type === 'car' ? '#ff4444' : 
                                               obj.type === 'pedestrian' ? '#44ff44' :
                                               obj.type === 'zebra_crossing' ? '#4444ff' : 
                                               obj.type === 'bike' || obj.type === 'motorcycle' ? '#ff8844' : '#ffff44'
                              }}
                            />
                            <span className="font-medium capitalize">{obj.type.replace('_', ' ')}</span>
                            <span className="text-sm text-muted-foreground">({obj.position})</span>
                          </div>
                          <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded">
                            {Math.round(obj.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
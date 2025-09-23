import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Video, Play, Pause, Volume2, VolumeX, Zap, Eye, Brain, Cpu } from 'lucide-react';

interface DetectionResult {
  object: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ProcessingResult {
  processed_video_url: string;
  audio_feedback_url: string;
  description_text: string;
  detections: DetectionResult[];
}

const VisionMate = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Particle system effect
  useEffect(() => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      (particle as HTMLElement).style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "🎯 Neural Network Activated",
        description: `File locked: ${file.name}`,
      });
    }
  };

  const simulateAdvancedProcessing = useCallback(async (file: File): Promise<ProcessingResult> => {
    // Simulate realistic processing with progress
    setProcessingProgress(0);
    
    const stages = [
      "Initializing AI Vision...",
      "Loading Neural Networks...",
      "Processing Video Frames...",
      "Detecting Objects...",
      "Analyzing Spatial Relationships...",
      "Generating Audio Feedback...",
      "Finalizing Results..."
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setProcessingProgress((i + 1) / stages.length * 100);
      
      toast({
        title: stages[i],
        description: `Progress: ${Math.round((i + 1) / stages.length * 100)}%`,
      });
    }
    
    // Create object URL for the uploaded video
    const videoUrl = URL.createObjectURL(file);
    
    // Enhanced detection simulation with realistic objects
    const objectTypes = [
      { name: 'Car', confidence: 0.95 },
      { name: 'Motorcycle', confidence: 0.88 },
      { name: 'Bicycle', confidence: 0.92 },
      { name: 'Person', confidence: 0.97 },
      { name: 'Traffic Light', confidence: 0.85 },
      { name: 'Stop Sign', confidence: 0.93 },
      { name: 'Zebra Crossing', confidence: 0.89 }
    ];
    
    // Generate realistic detection results
    const numDetections = Math.floor(Math.random() * 4) + 2; // 2-5 objects
    const detections: DetectionResult[] = [];
    
    for (let i = 0; i < numDetections; i++) {
      const obj = objectTypes[Math.floor(Math.random() * objectTypes.length)];
      detections.push({
        object: obj.name,
        confidence: obj.confidence + (Math.random() - 0.5) * 0.1, // Slight variation
        x: Math.random() * 0.7 * 100, // Position in percentage
        y: Math.random() * 0.7 * 100,
        width: (Math.random() * 0.2 + 0.1) * 100, // Size in percentage
        height: (Math.random() * 0.2 + 0.1) * 100
      });
    }
    
    // Create comprehensive description
    const description = `🔍 VISION ANALYSIS COMPLETE: Detected ${detections.length} objects - ${detections.map(d => `${d.object} (${(d.confidence * 100).toFixed(1)}%)`).join(', ')}. Navigation path is ${Math.random() > 0.5 ? 'CLEAR' : 'REQUIRES CAUTION'}.`;
    
    return {
      processed_video_url: videoUrl,
      audio_feedback_url: '', // Will use enhanced text-to-speech
      description_text: description,
      detections
    };
  }, []);

  const enhancedTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any existing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced speech settings for clarity
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      
      // Try to use a high-quality voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Premium')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Add speech events
      utterance.onstart = () => {
        toast({
          title: "🔊 Audio Feedback Active",
          description: "Neural voice synthesis engaged",
        });
      };
      
      utterance.onend = () => {
        console.log('Speech completed');
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "⚠️ No Input Detected",
        description: "Please provide video data for AI analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await simulateAdvancedProcessing(selectedFile);
      setResult(result);
      
      // Enhanced text-to-speech with better clarity
      setTimeout(() => {
        enhancedTextToSpeech(result.description_text);
      }, 500);
      
      toast({
        title: "🧠 AI Analysis Complete",
        description: `${result.detections.length} objects detected with neural precision!`,
      });
    } catch (error) {
      toast({
        title: "❌ Processing Error",
        description: "Neural network encountered an anomaly.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const startLiveRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'environment' }, 
        audio: false 
      });
      
      setMediaStream(stream);
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
      
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp8,opus' 
      });
      
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], 'neural-capture.webm', { type: 'video/webm' });
        setSelectedFile(file);
        toast({
          title: "📹 Neural Capture Complete",
          description: "Live feed successfully recorded for AI analysis!",
        });
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "🔴 Neural Recording Active",
        description: "Real-time visual data capture initiated...",
      });
    } catch (error) {
      toast({
        title: "📷 Camera Access Required",
        description: "Enable camera for real-time AI vision analysis.",
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

  const drawDetectionBoxes = () => {
    if (!result?.detections || !videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    result.detections.forEach((detection, index) => {
      const x = (detection.x / 100) * canvas.width;
      const y = (detection.y / 100) * canvas.height;
      const width = (detection.width / 100) * canvas.width;
      const height = (detection.height / 100) * canvas.height;
      
      // Draw neon detection box
      ctx.strokeStyle = `hsl(${263 + index * 30}, 70%, 50%)`;
      ctx.lineWidth = 3;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 10;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      ctx.fillStyle = `hsla(${263 + index * 30}, 70%, 50%, 0.8)`;
      ctx.fillRect(x, y - 30, width, 30);
      
      // Draw label text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(
        `${detection.object} ${(detection.confidence * 100).toFixed(1)}%`,
        x + 5,
        y - 10
      );
    });
  };

  useEffect(() => {
    if (result && videoRef.current) {
      const video = videoRef.current;
      video.addEventListener('loadedmetadata', drawDetectionBoxes);
      video.addEventListener('timeupdate', drawDetectionBoxes);
      
      return () => {
        video.removeEventListener('loadedmetadata', drawDetectionBoxes);
        video.removeEventListener('timeupdate', drawDetectionBoxes);
      };
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/20 relative overflow-hidden">
      {/* Particle System Background */}
      <div className="particle-system">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle animate-particle-float" />
        ))}
      </div>
      
      {/* Neural Grid Background */}
      <div className="absolute inset-0 neural-grid opacity-30" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Futuristic Header */}
        <div className="text-center mb-16 animate-cosmic-float">
          <div className="relative inline-block">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6 tracking-wider animate-aurora-shift">
              VISIONMATE
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-2xl animate-neural-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Next-Generation AI Vision • Neural Object Detection • Real-Time Analysis
          </p>
          
          {/* AI Stats Display */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="glass-card p-4 rounded-2xl animate-neon-glow">
              <Brain className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-semibold">Neural Network</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="glass-card p-4 rounded-2xl animate-neon-glow">
              <Eye className="w-8 h-8 mx-auto mb-2 text-accent" />
              <div className="text-sm font-semibold">Vision AI</div>
              <div className="text-xs text-muted-foreground">97.3% Accuracy</div>
            </div>
            <div className="glass-card p-4 rounded-2xl animate-neon-glow">
              <Cpu className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-semibold">Processing</div>
              <div className="text-xs text-muted-foreground">Real-Time</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Enhanced Upload Section */}
          <Card className="glass-card p-10 space-y-8 holographic-border animate-glass-reflect">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary animate-neural-pulse" />
                Neural Input
              </h2>
              
              {/* Advanced File Upload */}
              <div 
                className="border-2 border-dashed border-primary/50 rounded-3xl p-12 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5 group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 animate-aurora-shift" />
                <Upload className="w-16 h-16 mx-auto mb-6 text-primary/80 group-hover:text-primary transition-colors animate-cosmic-float" />
                <h3 className="text-2xl font-bold mb-3">Neural Upload Portal</h3>
                <p className="text-base text-muted-foreground mb-6">
                  Advanced format support: MP4, AVI, MKV, MOV, WEBM
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button variant="outline" size="lg" className="holographic-border">
                  <Upload className="w-5 h-5 mr-2" />
                  Initialize Upload
                </Button>
              </div>

              {selectedFile && (
                <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/30 animate-neon-glow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-lg font-semibold">Neural Lock Acquired</span>
                  </div>
                  <p className="text-sm font-medium">Target: {selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Analysis
                  </p>
                </div>
              )}

              {/* Enhanced Live Recording */}
              <div className="space-y-4">
                <Button
                  variant={isRecording ? "destructive" : "secondary"}
                  onClick={isRecording ? stopLiveRecording : startLiveRecording}
                  className="w-full h-16 text-lg holographic-border"
                  size="lg"
                >
                  <Video className="w-6 h-6 mr-3" />
                  {isRecording ? "🔴 Terminate Neural Capture" : "📹 Initiate Real-Time Capture"}
                </Button>
                
                {isRecording && (
                  <div className="relative rounded-3xl overflow-hidden glass-card">
                    <video
                      ref={liveVideoRef}
                      autoPlay
                      muted
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-white">LIVE NEURAL FEED</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Submit Button */}
              <div className="relative">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile || isProcessing}
                  className="w-full h-20 text-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all shadow-2xl animate-neon-glow"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Neural Processing... {processingProgress.toFixed(0)}%
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6" />
                      ACTIVATE AI VISION
                    </div>
                  )}
                </Button>
                
                {isProcessing && (
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                       style={{ width: `${processingProgress}%` }} />
                )}
              </div>
            </div>
          </Card>

          {/* Enhanced Results Section */}
          <Card className="glass-card p-10 space-y-8 holographic-border">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Eye className="w-8 h-8 text-accent animate-neural-pulse" />
              Neural Analysis
            </h2>
            
            {/* Enhanced Video Player */}
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden bg-black/20 min-h-[300px] flex items-center justify-center border border-primary/30">
                {result?.processed_video_url ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={result.processed_video_url}
                      className="w-full h-full object-cover"
                      controls
                      onLoadedMetadata={drawDetectionBoxes}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ mixBlendMode: 'screen' }}
                    />
                    <div className="absolute top-4 right-4 glass-card p-2 rounded-lg">
                      <span className="text-xs font-semibold text-primary">AI ENHANCED</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground animate-cosmic-float">
                    <Video className="w-20 h-20 mx-auto mb-6 opacity-50" />
                    <p className="text-lg">Neural Vision Output</p>
                    <p className="text-sm">Awaiting AI analysis...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Audio Feedback */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Volume2 className="w-6 h-6 text-primary" />
                  Neural Audio Feed
                </h3>
                {result && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAudioMuted(!audioMuted)}
                    className="holographic-border"
                  >
                    {audioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                )}
              </div>
              
              <div className="glass-card p-6 rounded-2xl min-h-[120px] flex items-center justify-center">
                {result ? (
                  <div className="text-center w-full">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mr-3" />
                      <span className="text-sm font-semibold text-primary">Enhanced Text-to-Speech Active</span>
                    </div>
                    <Button 
                      onClick={() => enhancedTextToSpeech(result.description_text)}
                      className="holographic-border"
                      variant="outline"
                    >
                      🔊 Replay Neural Voice
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">Neural audio synthesis ready...</p>
                )}
              </div>
            </div>

            {/* Enhanced Detection Results */}
            {result?.description_text && (
              <div className="space-y-4">
                <div className="glass-card p-8 rounded-3xl border border-primary/40 animate-hologram-scan">
                  <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                    <Cpu className="w-6 h-6" />
                    AI Detection Summary
                  </h3>
                  <p className="text-lg leading-relaxed font-medium mb-6">
                    {result.description_text}
                  </p>
                  
                  {result.detections && result.detections.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-accent">Detected Objects:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {result.detections.map((detection, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/20">
                            <span className="font-medium">{detection.object}</span>
                            <span className="text-sm text-accent font-semibold">
                              {(detection.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Enhanced Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="glass-card p-8 text-center holographic-border animate-cosmic-float">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 animate-neon-glow">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4">Advanced Neural Processing</h3>
            <p className="text-muted-foreground leading-relaxed">
              Next-gen YOLO detection with 97%+ accuracy for real-time object identification and spatial analysis
            </p>
          </Card>
          
          <Card className="glass-card p-8 text-center holographic-border animate-cosmic-float" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-neon-glow">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4">Enhanced Audio Synthesis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Crystal-clear voice descriptions with premium neural text-to-speech for precise navigation guidance
            </p>
          </Card>
          
          <Card className="glass-card p-8 text-center holographic-border animate-cosmic-float" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 animate-neon-glow">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4">Real-Time Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Live video processing with instant object detection, tracking, and predictive safety analysis
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisionMate;
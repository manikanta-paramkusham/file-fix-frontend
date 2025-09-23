import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Zap, Shield, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            About VisionMate
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            An innovative AI-powered assistive technology designed to help visually impaired individuals 
            navigate safely through urban environments by detecting zebra crossings and providing real-time audio guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center backdrop-blur-sm bg-card/95 border-primary/20 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Vision</h3>
            <p className="text-sm text-muted-foreground">
              Advanced YOLO object detection specifically trained for zebra crossing recognition
            </p>
          </Card>

          <Card className="p-6 text-center backdrop-blur-sm bg-card/95 border-primary/20 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Real-time</h3>
            <p className="text-sm text-muted-foreground">
              Instant processing and feedback for immediate navigation assistance
            </p>
          </Card>

          <Card className="p-6 text-center backdrop-blur-sm bg-card/95 border-primary/20 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Safety First</h3>
            <p className="text-sm text-muted-foreground">
              Designed with pedestrian safety as the primary concern and objective
            </p>
          </Card>

          <Card className="p-6 text-center backdrop-blur-sm bg-card/95 border-primary/20 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Accessible</h3>
            <p className="text-sm text-muted-foreground">
              Intuitive interface with comprehensive audio feedback for all users
            </p>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <Card className="p-8 backdrop-blur-sm bg-card/95 border-primary/20">
            <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Capture</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a video or use live camera feed to capture the environment
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Analyze</h3>
                <p className="text-sm text-muted-foreground">
                  AI processes the video using YOLO detection to identify zebra crossings
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Receive audio feedback and visual annotations for safe navigation
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 backdrop-blur-sm bg-card/95 border-primary/20">
            <h2 className="text-3xl font-bold mb-6 text-center">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Frontend</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• React with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Web APIs for camera and audio</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">AI Backend</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• YOLO object detection model</li>
                  <li>• Custom zebra crossing training</li>
                  <li>• Flask API server</li>
                  <li>• Real-time video processing</li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => window.location.href = '/'}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              Try VisionMate Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
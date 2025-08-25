"use client";

import { ReactNode, useEffect, useRef } from "react";
import clsx from "clsx";

interface NoiseOverlayProps {
  children: ReactNode;
  className?: string;
  contentAboveNoise?: ReactNode;
}

export default function NoiseOverlay({ children, className, contentAboveNoise }: NoiseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const generateNoise = () => {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Generate random black and white noise
      for (let i = 0; i < data.length; i += 4) {
        // Apply some bias toward darker values for more realistic TV static
        const biasedValue = Math.pow(Math.random(), 2) * 255;
        
        data[i] = biasedValue;     // Red
        data[i + 1] = biasedValue; // Green  
        data[i + 2] = biasedValue; // Blue
        data[i + 3] = 255;         // Alpha (fully opaque)
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      // Set canvas size to match container
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Set canvas display size to match actual size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    // Initial setup
    resizeCanvas();
    generateNoise();

    // Generate new noise 7 times per second
    const animationInterval = setInterval(generateNoise, 1000 / 12);

    // Handle window resize
    const handleResize = () => {
      resizeCanvas();
      generateNoise();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(animationInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={clsx("relative w-full h-full overflow-hidden", className)}>
      {/* Content */}
      {children}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
      
      {/* Canvas noise overlay */}
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-[0.10] mix-blend-overlay"
          style={{
            filter: "contrast(1.5) brightness(0.8)",
            pointerEvents: "none",
          }}
        />
      </div>
      
      {/* Additional static noise layer using the PNG for texture variation */}
      <div className="absolute inset-0 z-21 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "url('/media/graphics/noise.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
            animation: "noise-flicker 0.143s infinite steps(1)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content above noise overlay */}
      {contentAboveNoise && (
        <div className="absolute inset-0 z-30 pointer-events-auto">
          {contentAboveNoise}
        </div>
      )}

      <style jsx>{`
        @keyframes noise-flicker {
          0% { transform: translate(0px, 0px); }
          14.3% { transform: translate(-2px, 1px); }
          28.6% { transform: translate(1px, -3px); }
          42.9% { transform: translate(3px, 2px); }
          57.1% { transform: translate(-1px, -1px); }
          71.4% { transform: translate(2px, -2px); }
          85.7% { transform: translate(-3px, 1px); }
          100% { transform: translate(1px, 3px); }
        }
      `}</style>
    </div>
  );
}
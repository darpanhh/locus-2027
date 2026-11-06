import React, { useEffect, useRef } from 'react';

interface Colors {
  background: string;
  link: string;
  text: string;
  particle: string;
  particleStroke: string;
}

interface ParticleAnimationProps {
  opacity?: number;
  numParticles?: number;
  sizeMultiplier?: number;
  speed?: number;
  avoidMouse?: boolean;
  width?: number;
  connections?: boolean;
  connectionDensity?: number;
  noBounceH?: boolean;
  noBounceV?: boolean;
  speedH?: number;
  speedV?: number;
  hover?: boolean;
  colors?: Partial<Colors>;
  className?: string;
}

const defaultColors: Colors = {
  background: '#08070d',
  link: '#f472b6',
  text: '#fbcfe8',
  particle: '#f472b6',
  particleStroke: '#f472b6'
};

class Particle {
  public x: number;
  public y: number;
  private directionX: number;
  private directionY: number;
  private size: number;
  private readonly canvasContext: CanvasRenderingContext2D;
  private readonly canvas: HTMLCanvasElement;

  constructor(x: number, y: number, directionX: number, directionY: number, size: number, canvasContext: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.canvasContext = canvasContext;
    this.canvas = canvas;
  }

  draw(particleColor: string): void {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    this.canvasContext.fillStyle = particleColor;
    this.canvasContext.fill();
  }

  update(mousePosition: { x: number | undefined; y: number | undefined; radius: number }, avoidMouse: boolean, noBounceH: boolean, noBounceV: boolean, speedH: number, speedV: number, normalizedSpeed: number): void {
    // Boundary checks and movement logic
    if (noBounceH) {
      if ((speedH > 0 && this.x > this.canvas.width) || (speedH < 0 && this.x < 0)) {
        this.x = speedH > 0 ? 0 : this.canvas.width;
      }
    } else if (this.x > this.canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }

    if (noBounceV) {
      if ((speedV > 0 && this.y > this.canvas.height) || (speedV < 0 && this.y < 0)) {
        this.y = speedV > 0 ? 0 : this.canvas.height;
      }
    } else if (this.y > this.canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Mouse avoidance
    if (avoidMouse && mousePosition.x !== undefined && mousePosition.y !== undefined) {
      const dx = mousePosition.x - this.x;
      const dy = mousePosition.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mousePosition.radius + this.size) {
        if (mousePosition.x < this.x && this.x < this.canvas.width - this.size * 10) {
          this.x += 10;
        }
        if (mousePosition.x > this.x && this.x > this.size * 10) {
          this.x -= 10;
        }
        if (mousePosition.y < this.y && this.y < this.canvas.height - this.size * 10) {
          this.y += 10;
        }
        if (mousePosition.y > this.y && this.y > this.size * 10) {
          this.y -= 10;
        }
      }
    }

    // Move particle
    this.x += this.directionX * normalizedSpeed * speedH;
    this.y += this.directionY * normalizedSpeed * speedV;
  }
}

const ParticleAnimation: React.FC<ParticleAnimationProps> = ({
  opacity = 60,
  numParticles = 5,
  sizeMultiplier = 5,
  speed = 15,
  avoidMouse = false,
  width = 1.3,
  connections = true,
  connectionDensity = 7,
  noBounceH = false,
  noBounceV = false,
  speedH = 1,
  speedV = 1,
  hover = true,
  colors = defaultColors,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesArrayRef = useRef<Particle[]>([]);
  // Use refs instead of state to avoid re-renders on every mouse move
  const mousePositionRef = useRef<{ x: number | undefined; y: number | undefined; radius: number }>({
    x: undefined,
    y: undefined,
    radius: 0
  });

  const { particle: particleColor, particleStroke: strokeColor } = { ...defaultColors, ...colors };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) return;

    // Reduce particle count on mobile for better performance
    const isMobile = window.innerWidth < 768;
    const effectiveNumParticles = isMobile ? Math.max(2, Math.floor(numParticles * 0.5)) : numParticles;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mousePositionRef.current.radius = (canvas.height / 80) * (canvas.width / 80);
      initParticles(canvas, canvasContext);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current.x = event.x;
      mousePositionRef.current.y = event.y;
    };

    const handleMouseOut = () => {
      mousePositionRef.current.x = undefined;
      mousePositionRef.current.y = undefined;
    };

    const initParticles = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      particlesArrayRef.current = [];
      const numberOfParticles = (canvas.width * 0.01) * effectiveNumParticles;

      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * sizeMultiplier) + 1;
        const x = Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2;
        const y = Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2;
        
        const directionX = noBounceH ? Math.random() * 5 : (Math.random() * 5) - 2.5;
        const directionY = noBounceV ? Math.random() * 5 : (Math.random() * 5) - 2.5;

        particlesArrayRef.current.push(
          new Particle(x, y, directionX, directionY, size, context, canvas)
        );
      }
    };

    const connectParticles = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const particles = particlesArrayRef.current;
      const connectionDistance = Math.max(130, Math.min(canvas.width, canvas.height) / connectionDensity);
      const connectionDistanceSquared = connectionDistance * connectionDistance;
      const mousePos = mousePositionRef.current;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = dx * dx + dy * dy;

          if (distance < connectionDistanceSquared) {
            let opacityValue = 0.12 + (1 - (distance / connectionDistanceSquared)) * 0.38;
            
            if (hover && mousePos.x !== undefined && mousePos.y !== undefined) {
              const mouseDx = mousePos.x - particles[a].x; 
              const mouseDy = mousePos.y - particles[a].y;
              const mouseDistance = mouseDx * mouseDx + mouseDy * mouseDy;
              
              if (mouseDistance < 40000) { // 200^2 = 40000, avoid sqrt
                opacityValue = Math.min(opacityValue * 1.4, 0.65);
              }
            }

            context.globalAlpha = opacityValue;
            context.strokeStyle = strokeColor;
            context.lineWidth = width;
            context.beginPath();
            context.moveTo(particles[a].x, particles[a].y);
            context.lineTo(particles[b].x, particles[b].y);
            context.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!canvas || !canvasContext) return;
      
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      const normalizedSpeed = (speed !== 0) ? (speed / 100) : 0;
      const mousePos = mousePositionRef.current;
      canvasContext.globalAlpha = 1;
      particlesArrayRef.current.forEach(particle => {
        particle.update(mousePos, avoidMouse, noBounceH, noBounceV, speedH, speedV, normalizedSpeed);
        particle.draw(particleColor);
      });

      if (connections) {
        connectParticles(canvasContext, canvas);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    handleResize();
    canvas.style.opacity = (opacity / 100).toString();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseOut);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [opacity, numParticles, sizeMultiplier, speed, avoidMouse, width, connections, connectionDensity, noBounceH, noBounceV, speedH, speedV, hover, particleColor, strokeColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-animation ${className}`}
      style={{
        height: '100%',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  );
};

export default React.memo(ParticleAnimation);

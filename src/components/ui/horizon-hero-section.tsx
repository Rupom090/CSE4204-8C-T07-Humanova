import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { useUiStore } from '@/stores/uiStore';

gsap.registerPlugin(ScrollTrigger);

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  mountains: THREE.Mesh[];
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
  locations?: number[];
  accumulatedTime?: number;
  atmosphere?: THREE.Mesh | null;
}

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 2;

  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null
  });

  const getLocation = () => {
    const { current: refs } = threeRefs;
    const locations: number[] = [];
    refs.mountains.forEach((mountain, i) => {
      locations[i] = mountain.position.z;
    });
    refs.locations = locations;
  };

  // Initialize Three.js
  useEffect(() => {
    const { current: refs } = threeRefs;
    if (!canvasRef.current) return;

    const initThree = () => {
      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      // Renderer
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;

      // Post-processing
      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,
        0.4,
        0.85
      );
      refs.composer.addPass(bloomPass);

      // Create scene elements
      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();
      getLocation();

      // Start animation
      animate();

      // Mark as ready after Three.js is initialized
      setIsReady(true);
    };

    const createStarField = () => {
      const starCount = 2000; // Calibrated for performance

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          // Color variation matching crimson/cream
          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.6) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2); // Warm cream whites
          } else if (colorChoice < 0.9) {
            color.setHex(0xea1c24); // Bold Crimson
          } else {
            color.setHSL(0.6, 0.5, 0.8); // Deep indigos
          }

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              // Slow rotation based on depth
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene!.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const geometry = new THREE.PlaneGeometry(8000, 4000, 50, 50); // Lower segments for mobile frames
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xea1c24) }, // Crimson
          color2: { value: new THREE.Color(0x111111) }, // Bold Black
          opacity: { value: 0.25 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      refs.scene!.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      // Warm dark editorial publication tones
      const layers = [
        { distance: -50, height: 60, color: 0x111111, opacity: 1 },
        { distance: -100, height: 80, color: 0x1c1c24, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x2e1115, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x3d0c11, opacity: 0.4 }
      ];

      layers.forEach((layer, index) => {
        const points = [];
        const segments = 40;

        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y = Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 - 100;
          points.push(new THREE.Vector2(x, y));
        }

        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index };
        refs.scene!.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.92, 0.11, 0.14) * intensity; // Red atmospheric tint
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.2);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene!.add(atmosphere);
      refs.atmosphere = atmosphere;
    };

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);

      if (refs.accumulatedTime === undefined) {
        refs.accumulatedTime = 0;
      }

      const delta = 0.016; // 60fps delta approx
      const isAuditing = useUiStore.getState().sandboxAuditing;
      const speedMultiplier = isAuditing ? 18.0 : 1.0;
      refs.accumulatedTime += delta * speedMultiplier;

      const accTime = refs.accumulatedTime;

      // Update stars
      refs.stars.forEach((starField) => {
        const material = starField.material as THREE.ShaderMaterial;
        if (material && material.uniforms) {
          material.uniforms.time.value = accTime;
        }
      });

      // Update nebula
      if (refs.nebula) {
        const material = refs.nebula.material as THREE.ShaderMaterial;
        if (material && material.uniforms) {
          material.uniforms.time.value = accTime * 0.5;
        }
      }

      // Update atmosphere if available
      if (refs.atmosphere) {
        const material = refs.atmosphere.material as THREE.ShaderMaterial;
        if (material && material.uniforms) {
          material.uniforms.time.value = accTime;
        }
      }

      // Smooth camera movement with easing
      if (
        refs.camera &&
        refs.targetCameraX !== undefined &&
        refs.targetCameraY !== undefined &&
        refs.targetCameraZ !== undefined
      ) {
        const smoothingFactor = 0.05;

        const targetX = refs.targetCameraX;
        let targetY = refs.targetCameraY;
        let targetZ = refs.targetCameraZ;

        // If sandbox auditing is active, zoom forward smoothly
        if (isAuditing) {
          targetZ -= 200; // zoom forward deep
          targetY -= 15; // lower perspective
        }

        smoothCameraPos.current.x += (targetX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (targetY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (targetZ - smoothCameraPos.current.z) * smoothingFactor;

        const floatX = Math.sin(accTime * 0.1) * 2;
        const floatY = Math.cos(accTime * 0.15) * 1;

        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      // Parallax mountains
      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(accTime * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + (Math.cos(accTime * 0.15) * 1 * parallaxFactor);
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    initThree();

    // Handle resize
    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);

      // Dispose Three.js resources
      refs.stars.forEach(starField => {
        starField.geometry.dispose();
        (starField.material as THREE.Material).dispose();
      });

      refs.mountains.forEach(mountain => {
        mountain.geometry.dispose();
        (mountain.material as THREE.Material).dispose();
      });

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        (refs.nebula.material as THREE.Material).dispose();
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, []);

  // GSAP Animations - Run after component is ready
  useEffect(() => {
    if (!isReady) return;

    // Set initial states to prevent flash
    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: 'visible'
    });

    const tl = gsap.timeline();

    // Animate menu
    if (menuRef.current) {
      tl.from(menuRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }

    // Animate title with split text
    if (containerRef.current) {
      const titleChars = containerRef.current.querySelectorAll('.title-char');
      if (titleChars.length > 0) {
        tl.from(titleChars, {
          y: 120,
          opacity: 0,
          duration: 1.2,
          stagger: 0.04,
          ease: "power4.out"
        }, "-=0.5");
      }
    }

    // Animate subtitle lines
    if (subtitleRef.current) {
      const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
      tl.from(subtitleLines, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      }, "-=0.8");
    }

    // Animate scroll indicator
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight || 1;
      const progress = Math.min(scrollY / maxScroll, 1);

      setScrollProgress(progress);
      const newSection = Math.floor(progress * totalSections);
      setCurrentSection(newSection);

      const { current: refs } = threeRefs;

      // Calculate smooth progress through all sections
      const totalProgress = progress * totalSections;
      const sectionProgress = totalProgress % 1;

      // Define camera positions for each section
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },    // Section 0 - HORIZON
        { x: 0, y: 40, z: -50 },     // Section 1 - COSMOS
        { x: 0, y: 50, z: -700 }       // Section 2 - INFINITY
      ];

      // Get current and next positions
      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[newSection + 1] || currentPos;

      // Set target positions (actual smoothing happens in animate loop)
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      // Smooth parallax for mountains
      if (refs.mountains && refs.mountains.length > 0) {
        refs.mountains.forEach((mountain, i) => {
          const speed = 1 + i * 0.9;
          const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5;
          if (refs.nebula) {
            refs.nebula.position.z = (targetZ + progress * speed * 0.01) - 100;
          }

          mountain.userData.targetZ = targetZ;
          if (progress > 0.7) {
            mountain.position.z = 600000;
          } else {
            mountain.position.z = refs.locations ? refs.locations[i] : mountain.userData.baseZ;
          }
        });
        if (refs.nebula && refs.mountains[3]) {
          refs.nebula.position.z = refs.mountains[3].position.z;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const splitTitle = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="title-char inline-block" style={{ contentVisibility: 'auto' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-[#050505] text-[#FAF8F5]">
      {/* 3D WebGL Canvas Backdrop */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Editorial aesthetic vignetting */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-0 opacity-40" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-0 opacity-40" />

      {/* Side menu */}
      <div ref={menuRef} className="fixed left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-6" style={{ visibility: 'hidden' }}>
        <div className="flex flex-col gap-1.5 cursor-pointer group p-2">
          <span className="w-5 h-[2px] bg-[#FAF8F5] group-hover:bg-[#ea1c24] transition-all"></span>
          <span className="w-5 h-[2px] bg-[#FAF8F5] group-hover:bg-[#ea1c24] transition-all"></span>
          <span className="w-5 h-[2px] bg-[#FAF8F5] group-hover:bg-[#ea1c24] transition-all"></span>
        </div>
        <div className="font-display font-bold text-[10px] tracking-[0.4em] uppercase [writing-mode:vertical-lr] rotate-180 select-none opacity-40 text-[#FAF8F5]">
          HUMANOVA // SPACE
        </div>
      </div>

      {/* Main Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pointer-events-none">
        <h1 ref={titleRef} className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] uppercase tracking-[0.25em] leading-none text-[#FAF8F5] select-none flex flex-wrap justify-center overflow-hidden">
          {splitTitle("HORIZON")}
        </h1>

        <div ref={subtitleRef} className="max-w-xl mx-auto space-y-1.5 mt-8 text-xs sm:text-sm tracking-wider uppercase font-display font-bold text-[#FAF8F5]/65">
          <p className="subtitle-line block overflow-hidden leading-relaxed">
            Where secure vision meets clinical reality,
          </p>
          <p className="subtitle-line block overflow-hidden leading-relaxed">
            we align the generative future of trust.
          </p>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div ref={scrollProgressRef} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3" style={{ visibility: 'hidden' }}>
        <div className="font-display text-[9px] font-bold tracking-[0.3em] text-[#FAF8F5]/50 uppercase">SCROLL ENGINE</div>
        <div className="w-36 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full bg-[#ea1c24] transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="font-display text-[9px] font-bold tracking-widest text-[#FAF8F5]/40 mt-1">
          {String(currentSection + 1).padStart(2, '0')} / {String(totalSections + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Additional content sections for scrolling */}
      <div className="relative z-10 pointer-events-none select-none">
        {[...Array(2)].map((_, i) => {
          const titles: Record<number, string> = {
            1: 'COSMOS',
            2: 'INFINITY'
          };

          const subtitles: Record<number, { line1: string; line2: string }> = {
            1: {
              line1: 'Beyond the boundaries of simple models,',
              line2: 'lies the universe of governed possibilities.'
            },
            2: {
              line1: 'In the space between prompt and response,',
              line2: 'we secure true clinical enterprise trust.'
            }
          };

          return (
            <section key={i} className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 pointer-events-none relative">
              <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] uppercase tracking-[0.25em] leading-none text-[#FAF8F5] select-none flex flex-wrap justify-center overflow-hidden">
                {splitTitle(titles[i + 1] || 'COSMOS')}
              </h1>

              <div className="max-w-xl mx-auto space-y-1.5 mt-8 text-xs sm:text-sm tracking-wider uppercase font-display font-bold text-[#FAF8F5]/65">
                <p className="subtitle-line block overflow-hidden leading-relaxed">
                  {subtitles[i + 1].line1}
                </p>
                <p className="subtitle-line block overflow-hidden leading-relaxed">
                  {subtitles[i + 1].line2}
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

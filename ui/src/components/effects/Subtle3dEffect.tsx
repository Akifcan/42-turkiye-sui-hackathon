import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SubtleShader = {
  uniforms: {
    uTime: { value: 0.0 },
    uColor1: { value: new THREE.Color("#c3a97f") }, // accent-1
    uColor2: { value: new THREE.Color("#8dbbdb") }, // accent-3
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;

    // 2D Noise from https://www.shadertoy.com/view/MsfGzM
    vec3 hash( vec3 p ) {
      p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
            dot(p,vec3(269.5,183.3,246.1)),
            dot(p,vec3(113.5,271.9,124.6)));
      return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }

    float noise( in vec3 p ) {
      vec3 i = floor( p );
      vec3 f = fract( p );
      vec3 u = f*f*(3.0-2.0*f);
      return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                              dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                         mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                              dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                    mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                              dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                         mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                              dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
    }

    void main() {
      float n = noise(vec3(vUv * 3.0, uTime * 0.1));
      
      vec3 color = mix(uColor1, uColor2, smoothstep(0.4, 0.6, n));
      
      gl_FragColor = vec4(color, pow(abs(n), 1.5) * 0.15);
    }
  `,
};

function Subtle3dPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame(({ clock }) => {
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  const shaderArgs = useMemo(() => SubtleShader, []);

  return (
    <mesh>
      <planeGeometry args={[5, 5]} />
      <shaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function Subtle3dEffect() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas>
        <Subtle3dPlane />
      </Canvas>
    </div>
  );
}

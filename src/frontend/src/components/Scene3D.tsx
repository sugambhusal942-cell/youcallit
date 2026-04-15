import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

const CATEGORIES = [
  { label: "Starters", color: "#c8a96e", angle: 0 },
  { label: "Mains", color: "#e0c27a", angle: (Math.PI * 2) / 5 },
  { label: "Desserts", color: "#d4956a", angle: (Math.PI * 4) / 5 },
  { label: "Drinks", color: "#9bcce0", angle: (Math.PI * 6) / 5 },
  { label: "Chef Specials", color: "#f0d080", angle: (Math.PI * 8) / 5 },
] as const;

type CategoryLabel = (typeof CATEGORIES)[number]["label"];

interface OrbitalNodeProps {
  label: CategoryLabel;
  color: string;
  angle: number;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (v: boolean) => void;
  globalRotation: number;
}

function OrbitalNode({
  label: _label,
  color,
  angle,
  isActive,
  isHovered,
  onClick,
  onHover,
  globalRotation,
}: OrbitalNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const RADIUS = 2.2;

  const currentAngle = angle + globalRotation;
  const x = Math.cos(currentAngle) * RADIUS;
  const z = Math.sin(currentAngle) * RADIUS;
  const yBob = Math.sin(currentAngle * 2 + globalRotation) * 0.12;

  useFrame((_, delta) => {
    if (!meshRef.current || !glowRef.current) return;
    meshRef.current.rotation.y += delta * 0.8;
    meshRef.current.rotation.x += delta * 0.3;
    const scale = isActive ? 1.35 : isHovered ? 1.18 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.12);
    glowRef.current.scale.lerp(
      new THREE.Vector3(scale * 1.8, scale * 1.8, scale * 1.8),
      0.08,
    );
  });

  const colorObj = new THREE.Color(color);
  const glowColor = colorObj.clone().multiplyScalar(0.5);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: R3F 3D element cannot receive DOM keyboard events
    <group
      position={[x, yBob, z]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={isActive ? 0.35 : 0.18}
        />
      </mesh>

      {/* Core sphere */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 1.5 : isHovered ? 0.9 : 0.45}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.018, 8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.8 : 0.35}
        />
      </mesh>
    </group>
  );
}

function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.2, 0.008, 6, 128]} />
      <meshBasicMaterial color="#c8a96e" transparent opacity={0.12} />
    </mesh>
  );
}

function CenterGem() {
  const gemRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!gemRef.current) return;
    gemRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    gemRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
  });
  return (
    <mesh ref={gemRef}>
      <icosahedronGeometry args={[0.3, 1]} />
      <meshStandardMaterial
        color="#c8a96e"
        emissive="#c8a96e"
        emissiveIntensity={0.7}
        roughness={0.05}
        metalness={0.95}
        wireframe={false}
      />
    </mesh>
  );
}

function Scene({
  activeCategory,
  onSelect,
}: {
  activeCategory: string;
  onSelect: (label: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const rotRef = useRef(0);
  const [rotVal, setRotVal] = useState(0);

  useFrame((_, delta) => {
    rotRef.current += delta * 0.18;
    setRotVal(rotRef.current);
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#1a0f00" />
      <pointLight
        position={[0, 3, 0]}
        intensity={2.5}
        color="#c8a96e"
        distance={8}
      />
      <pointLight
        position={[-3, -2, 2]}
        intensity={0.8}
        color="#8060a0"
        distance={6}
      />
      <pointLight
        position={[3, -1, -2]}
        intensity={0.6}
        color="#205080"
        distance={6}
      />

      <OrbitRing />
      <CenterGem />

      {CATEGORIES.map((cat) => (
        <OrbitalNode
          key={cat.label}
          label={cat.label}
          color={cat.color}
          angle={cat.angle}
          isActive={activeCategory === cat.label}
          isHovered={hovered === cat.label}
          globalRotation={rotVal}
          onClick={() => onSelect(cat.label)}
          onHover={(v) => setHovered(v ? cat.label : null)}
        />
      ))}
    </>
  );
}

interface Scene3DProps {
  activeCategory: string;
  onSelect: (label: string) => void;
}

// Label positions computed from current rotation - shown as HTML overlay
function CategoryLabels({
  activeCategory,
  onSelect,
}: {
  activeCategory: string;
  onSelect: (label: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.label}
          type="button"
          onClick={() => onSelect(cat.label)}
          className="px-3 py-1 rounded-full text-xs font-body font-semibold transition-smooth border"
          style={{
            borderColor:
              activeCategory === cat.label ? cat.color : `${cat.color}40`,
            color: activeCategory === cat.label ? cat.color : "#a0a0a0",
            background:
              activeCategory === cat.label ? `${cat.color}18` : "transparent",
            textShadow:
              activeCategory === cat.label ? `0 0 8px ${cat.color}80` : "none",
          }}
          data-ocid={`menu.3d_category_label.${cat.label.toLowerCase().replace(/\s+/g, "_")}`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export function Scene3D({ activeCategory, onSelect }: Scene3DProps) {
  return (
    <div className="relative w-full select-none" style={{ height: 220 }}>
      <Canvas
        camera={{ position: [0, 2.2, 5.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Scene activeCategory={activeCategory} onSelect={onSelect} />
      </Canvas>
      {/* HTML labels below canvas */}
      <div className="absolute bottom-0 left-0 right-0">
        <CategoryLabels activeCategory={activeCategory} onSelect={onSelect} />
      </div>
    </div>
  );
}

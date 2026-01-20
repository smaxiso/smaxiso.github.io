'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Billboard, Line } from '@react-three/drei'
import * as THREE from 'three'

interface ParticleData {
    label: string;
    value: number;
    color?: string;
}

// --- SUB-COMPONENT: The Network Scene ---
function NetworkGroup({ data, autoRotateSpeed = 0.15 }: { data: ParticleData[], autoRotateSpeed?: number }) {
    const groupRef = useRef<THREE.Group>(null);

    // Smooth auto-rotation frame by frame
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * autoRotateSpeed;
        }
    });

    // Calculate Geometry (Memoized for Performance)
    // This only runs ONCE when data changes, not every frame.
    const { particles, connections } = useMemo(() => {
        const defaultColors = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#ef4444'];

        // 1. Generate Points using Fibonacci Sphere Algorithm (Even Distribution)
        const pts = data.map((item, i) => {
            // Golden Ratio math to prevent "clumping" at poles
            const phi = Math.acos(1 - 2 * (i + 0.5) / data.length);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;

            const radius = 6;
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            // Safety check for NaNs
            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                return { ...item, pos: new THREE.Vector3(0, 0, 0), color: item.color || '#fff' };
            }

            return {
                ...item,
                pos: new THREE.Vector3(x, y, z),
                color: item.color || defaultColors[i % defaultColors.length]
            };
        });

        // 2. Generate Lines based on distance
        const lines: any[] = [];
        pts.forEach((p1, i) => {
            pts.forEach((p2, j) => {
                if (i >= j) return;

                // Calculate 3D distance between vectors
                const dist = p1.pos.distanceTo(p2.pos);

                // Threshold: Only connect if close enough
                if (dist < 5.5) {
                    lines.push({
                        start: p1.pos,
                        end: p2.pos,
                        color: p1.color // Inherit color from start node
                    });
                }
            });
        });

        return { particles: pts, connections: lines };
    }, [data]);

    return (
        <group ref={groupRef}>
            {/* RENDER CONNECTIONS */}
            {connections.map((line, i) => (
                <Line
                    key={`line-${i}`}
                    points={[line.start, line.end]} // Exact vector connection
                    color={line.color}
                    lineWidth={1.5} // Volumetric width (not pixel width)
                    transparent
                    opacity={0.15}
                />
            ))}

            {/* RENDER NODES */}
            {particles.map((p, i) => (
                <group key={`p-${i}`} position={p.pos}>
                    {/* 1. The Real Sphere (Geometry) */}
                    <mesh>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshStandardMaterial
                            color={p.color}
                            emissive={p.color}
                            emissiveIntensity={3}
                            toneMapped={false}
                        />
                    </mesh>

                    {/* 2. The Glow Halo (Billboarded to face camera) */}
                    <Billboard>
                        <mesh>
                            <circleGeometry args={[0.5, 32]} />
                            <meshBasicMaterial
                                color={p.color}
                                transparent
                                opacity={0.3}
                                depthWrite={false} // Prevents "square" artifacts
                            />
                        </mesh>
                    </Billboard>

                    {/* 3. The HTML Label */}
                    <Html
                        position={[0, 0.4, 0]}
                        center
                        distanceFactor={12} // Scales text based on distance
                        zIndexRange={[100, 0]}
                        style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
                    >
                        <div className="text-center select-none transform-gpu">
                            <div
                                className="font-bold text-xs drop-shadow-md text-slate-800 dark:text-white/90"
                                style={{ textShadow: `0 0 10px ${p.color}, 0 0 20px rgba(0,0,0,0.3)` }}
                            >
                                {p.label}
                            </div>
                            <div
                                className="font-black text-[10px]"
                                style={{ color: p.color, textShadow: '0 0 5px rgba(0,0,0,0.5)' }}
                            >
                                {p.value}%
                            </div>
                        </div>
                    </Html>
                </group>
            ))}
        </group>
    );
}

// --- MAIN EXPORT COMPONENT ---
export function ParticleNetwork3D({ data = [], height = "600px", className = "" }: any) {
    // Fallback data for testing
    const safeData = data.length > 0 ? data : [
        { label: "React", value: 95, color: "#61dafb" },
        { label: "TypeScript", value: 90, color: "#3178c6" },
        { label: "Node.js", value: 85, color: "#339933" },
        { label: "Python", value: 80, color: "#FFE873" },
        { label: "AWS", value: 75, color: "#FF9900" },
        { label: "Docker", value: 70, color: "#2496ED" },
        { label: "GraphQL", value: 82, color: "#E10098" },
        { label: "Next.js", value: 88, color: "#ffffff" },
    ];

    return (
        <div
            className={`w-full relative bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl ${className}`}
            style={{ height }}
        >
            <Canvas
                camera={{ position: [0, 0, 16], fov: 45 }}
                dpr={[1, 2]} // Handles High-DPI (Retina) screens
                gl={{ alpha: true }} // Enable transparency
            >
                {/* LIGHTING */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* CONTROLS (Restricted to keep view nice) */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    minPolarAngle={Math.PI / 4} // Prevent looking from bottom
                    maxPolarAngle={Math.PI / 1.5} // Prevent looking from top
                />

                {/* SCENE */}
                <NetworkGroup data={safeData} />
            </Canvas>
        </div>
    )
}

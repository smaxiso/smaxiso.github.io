import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useTheme } from 'next-themes'

function Stars(props: any) {
    const ref = useRef<any>(null)
    const { theme } = useTheme();
    const [color, setColor] = useState('#3b82f6'); // Default Blue-500

    useEffect(() => {
        // Darker blue (blue-700) for light mode visibility, lighter blue (blue-400) for dark mode
        setColor(theme === 'light' ? '#1d4ed8' : '#60a5fa')
    }, [theme]);

    // Manual sphere point generation to avoid maath dependency issues
    const sphere = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        const radius = 1.5;

        for (let i = 0; i < count; i++) {
            const r = radius * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            // Safety check
            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                positions[i * 3] = 0;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = 0;
            } else {
                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;
            }
        }
        return positions;
    }, [])

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10
            ref.current.rotation.y -= delta / 15
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={theme === 'light' ? 1 : 0.5} // Higher opacity for light mode
                />
            </Points>
        </group>
    )
}

export function HeroBackground() {
    return (
        <div className="absolute inset-0 -z-0">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
            </Canvas>
        </div>
    )
}

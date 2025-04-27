'use client';

import { FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface CraneVisualizationProps {
  swingDeg: number;
  liftMm: number;
  elbowDeg: number;
  wristDeg: number;
  gripperMm: number;
}

const CraneVisualization: FC<CraneVisualizationProps> = ({
  swingDeg,
  liftMm,
  elbowDeg,
  wristDeg,
  gripperMm,
}) => {
  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Base */}
        <mesh rotation={[0, (swingDeg * Math.PI) / 180, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Column */}
        <mesh position={[0, liftMm / 1000, 0]} rotation={[0, (swingDeg * Math.PI) / 180, 0]}>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial color="blue" />
        </mesh>

        {/* Arm */}
        <mesh 
          position={[0, liftMm / 1000, 0]} 
          rotation={[0, (swingDeg * Math.PI) / 180, (elbowDeg * Math.PI) / 180]}
        >
          <boxGeometry args={[2, 0.2, 0.2]} />
          <meshStandardMaterial color="red" />
        </mesh>

        {/* Wrist */}
        <mesh 
          position={[2, liftMm / 1000, 0]} 
          rotation={[0, (swingDeg * Math.PI) / 180, ((elbowDeg + wristDeg) * Math.PI) / 180]}
        >
          <boxGeometry args={[0.5, 0.1, 0.1]} />
          <meshStandardMaterial color="green" />
        </mesh>

        {/* Gripper */}
        <mesh 
          position={[2.25, liftMm / 1000, 0]} 
          rotation={[0, (swingDeg * Math.PI) / 180, ((elbowDeg + wristDeg) * Math.PI) / 180]}
        >
          <boxGeometry args={[0.1, 0.1, gripperMm / 1000]} />
          <meshStandardMaterial color="yellow" />
        </mesh>

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default CraneVisualization; 
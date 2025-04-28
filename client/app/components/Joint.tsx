

type JointProps = {
    position: [number, number, number],
    color?: string,
    radius?: number,
    height?: number
}

const Joint = ({ position, color = 'red', radius = 0.09, height = 0.08 }: JointProps) => (
    <mesh position={position}>
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
);

export default Joint;
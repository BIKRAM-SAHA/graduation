import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

function Floor() {
    const floorRef = useRef<Mesh>(null!);
    useFrame(() => {
        if (!floorRef.current) {
            return;
        }
        floorRef.current.rotation.x = -0.5 * Math.PI;
        floorRef.current.position.y = -11;
    });
    return (
        <mesh ref={floorRef} receiveShadow={true}>
            <planeGeometry args={[100, 100]} />
            <meshPhongMaterial args={[{ color: 0xeeeeee, shininess: 0 }]} />
        </mesh>
    );
}

export default Floor;

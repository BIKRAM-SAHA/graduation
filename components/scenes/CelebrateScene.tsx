import { Canvas } from "@react-three/fiber";
import Floor from "../three/Floor";
import { useState } from "react";

export default function CelebrateScene() {
    const [flameModel, setFlameModel] = useState<any>(null);

    return (
        <Canvas
            camera={{
                fov: 50,
                near: 0.1,
                far: 1000,
                position: [0, -3, 30],
            }}
            onCreated={(state: any) => {
                const _gl = state.gl.getContext();
                const pixelStorei = _gl.pixelStorei.bind(_gl);
                _gl.pixelStorei = function (...args: any) {
                    const [parameter] = args;
                    switch (parameter) {
                        case _gl.UNPACK_FLIP_Y_WEBGL:
                            return pixelStorei(...args);
                    }
                };
            }}
        >
            <hemisphereLight
                args={[0xffffff, 0xffffff, 0.61]}
                position={[0, 50, 0]}
            />
            <directionalLight
                args={[0xffffff, 0.54]}
                position={[-8, 12, 8]}
                castShadow={true}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={0.1}
                shadow-camera-far={1500}
                shadow-camera-left={8.25 * -1}
                shadow-camera-right={8.25}
                shadow-camera-top={8.25}
                shadow-camera-bottom={8.25 * -1}
            />

            {/* <primitive object={flameModel}></primitive> */}

            {/* Candle */}
            <mesh position={[0, -8, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 2]} />
                <meshPhongMaterial color={"gray"} />
            </mesh>
            {/* Cake */}
            <mesh position={[0, -10, 0]}>
                <cylinderGeometry
                    args={[3, 3, 2, undefined, undefined, undefined, 7, 5.45]}
                />
                <meshPhongMaterial color={"hotpink"} />
            </mesh>
            <mesh position={[1, -10, 1.2]} rotation-y={-Math.PI / 3.8}>
                <planeGeometry args={[2.8, 2]} />
                <meshPhongMaterial color={"pink"} />
            </mesh>
            <mesh position={[-0.16, -10, 1.2]} rotation-y={Math.PI / 2.2}>
                <planeGeometry args={[2.8, 2]} />
                <meshPhongMaterial color={"pink"} />
            </mesh>

            <mesh position={[-0.25, -2.5, -15]}>
                <sphereGeometry args={[8, 32, 32]} />
                <meshBasicMaterial color={0x9bffaf} />
            </mesh>
            <Floor />
        </Canvas>
    );
}

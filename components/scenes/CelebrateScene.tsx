import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import ExpoTHREE, { loadAsync, Renderer, THREE } from "expo-three";
// import OrbitControlsView from 'expo-three-orbit-controls';
import Floor from "../three/Floor";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export default function CelebrateScene() {
    const [flameModel, setFlameModel] = useState<any>(null);
    const cameraRef = useRef<THREE.Camera>();

    const timeoutRef = useRef<number>();
    useEffect(() => {
        // Clear the animation loop when the component unmounts
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const sceneRef = useRef<THREE.Scene>();
    const clockRef = useRef<THREE.Clock>();

    const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
        // removes the warning EXGL: gl.pixelStorei() doesn't support this parameter yet!
        const pixelStorei = gl.pixelStorei.bind(gl);
        gl.pixelStorei = function (...args) {
            const [parameter] = args;
            switch (parameter) {
                case gl.UNPACK_FLIP_Y_WEBGL:
                    return pixelStorei(...args);
            }
        };

        const renderer = new Renderer({ gl });
        let cam = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.25,
            100
        );
        cam.position.set(7, 3, 10);
        cam.lookAt(0, 2, 0);
        cameraRef.current = cam;

        sceneRef.current = new THREE.Scene();
        sceneRef.current.background = new THREE.Color(0xe0e0e0);
        sceneRef.current.fog = new THREE.Fog(0xe0e0e0, 20, 100);

        clockRef.current = new THREE.Clock();

        // lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemiLight.position.set(0, 20, 0);
        sceneRef.current.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(0, 20, 10);
        sceneRef.current.add(dirLight);

        // ground
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
        );
        mesh.rotation.x = -Math.PI / 2;
        sceneRef.current.add(mesh);

        //cake
        const cakeMeshSide = new THREE.Mesh(
            new THREE.CylinderGeometry(
                3,
                3,
                2,
                undefined,
                undefined,
                undefined,
                7,
                5.45
            ),
            new THREE.MeshPhongMaterial({ color: "hotpink" })
        );
        cakeMeshSide.position.set(0, 0, 0);
        sceneRef.current.add(cakeMeshSide);
        const cakeMeshEnd1 = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 2),
            new THREE.MeshPhongMaterial({ color: "hotpink" })
        );
        cakeMeshEnd1.position.set(1, 0, 1.15);
        cakeMeshEnd1.rotateY(-Math.PI / 3.7);
        sceneRef.current.add(cakeMeshEnd1);
        const cakeMeshEnd2 = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 2),
            new THREE.MeshPhongMaterial({ color: "hotpink" })
        );
        cakeMeshEnd2.position.set(-0.2, 0, 1.45);
        cakeMeshEnd2.rotateY(Math.PI / 2.2);
        sceneRef.current.add(cakeMeshEnd2);

        //candle
        // const flame = await ExpoTHREE.loadAsync(
        //     [
        //         require("../../assets/models/flame/flame.obj"),
        //         require("../../assets/models/flame/flame.mtl"),
        //     ],
        //     undefined,
        //     (imageName) => console.log(imageName)
        // );
        // console.log(flame);
        // sceneRef.current.add(flame);
        // const model = await loadAsync("../../assets/models/flame/flame.gltf");
        // console.log(model);

        const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        sceneRef.current.add(grid);

        function animate() {
            timeoutRef.current = requestAnimationFrame(animate);

            if (cameraRef.current && sceneRef.current) {
                renderer.render(sceneRef.current, cameraRef.current);
            }
            gl.endFrameEXP();
        }
        animate();
    };

    return (
        <>
            <ThemedView style={styles.messageContainer}>
                <ThemedText>This one is for you! 🍫❤️</ThemedText>
                <ThemedText>PS: couldnt resist taking a bite 😋</ThemedText>
            </ThemedView>

            <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
        </>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        backgroundColor: "lightblue",
        padding: 12,
        alignItems: "center",
    },
});

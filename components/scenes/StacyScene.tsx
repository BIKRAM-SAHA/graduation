import { Suspense, useEffect, useState } from "react";
import Floor from "../three/Floor";
import { ThemedView } from "../ThemedView";
import useStacyAnimate, { StacyAnimations } from "@/hooks/useStacyAnimate";
import { useGLTF, useTexture } from "@react-three/drei";
import { Clock, MeshPhongMaterial } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { router } from "expo-router";
import { ThemedText } from "../ThemedText";
import { Pressable, StyleSheet } from "react-native";

import stacyModelPath from "@/assets/models/stacy_lightweight.glb";
import stacyTexturePath from "@/assets/textures/stacy.jpg";

type PerformAction = { animation: keyof StacyAnimations; repetition: number };
type ModelProps = { performAction?: PerformAction };

function Model({ performAction }: ModelProps) {
    const [gltf, _] = useState(useGLTF(stacyModelPath));
    const [mixer, clip, availableAnimations, startClip] = useStacyAnimate(gltf);

    const stacyTxt = useTexture(stacyTexturePath);
    stacyTxt.flipY = false;
    const stacy_mtl = new MeshPhongMaterial({
        map: stacyTxt,
        color: 0xffffff,
    });

    const cloak = new Clock(true);
    const model = gltf.scene;

    useFrame(() => {
        clip.play();
        if (mixer) {
            mixer.update(cloak.getDelta());
        }
        model.scale.set(7, 7, 7);
        model.traverse((o: any) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
                o.material = stacy_mtl;
            }
        });
        model.position.y = -11;
    });

    useEffect(() => {
        if (performAction) {
            const { animation, repetition } = performAction;
            startClip(animation, repetition);
        }
    }, [performAction]);

    return (
        <primitive object={gltf.scene}>
            <meshPhongMaterial args={[{ map: stacyTxt, color: 0xffffff }]} />
        </primitive>
    );
}

type SceneDetails = {
    buttonTitle: string;
    stacyMessage: string;
};
type Scenes = {
    "1": SceneDetails;
    "2": SceneDetails;
    "3": SceneDetails;
    "4": SceneDetails;
    "5": SceneDetails;
    "6": SceneDetails;
};
const scene: Scenes = {
    "1": {
        stacyMessage: "Hi there!",
        buttonTitle: "Hi !",
    },
    "2": {
        stacyMessage: "Heard you graduated 👀, Congratulationsss!!!!",
        buttonTitle: "Thanks !",
    },
    "3": {
        stacyMessage: "We should totally celebrate this 🔥",
        buttonTitle: "Okeii 👀",
    },
    "4": {
        stacyMessage:
            "I hope everythings ready by now. Now where did I keep it?!😕",
        buttonTitle: "What?",
    },
    "5": {
        stacyMessage: "Why dont u see for yourself!",
        buttonTitle: "🫡",
    },
    "6": {
        stacyMessage: "Less Gooo!!",
        buttonTitle: "",
    },
};

export default function StacyScene() {
    const [stacyAction, setStacyAction] = useState<PerformAction | undefined>();
    const [buttonTitle, setButtonTitle] = useState(scene[1].buttonTitle);
    const [stacyMessage, setStacyMessage] = useState(scene[1].stacyMessage);
    const [sceneCnt, setSceneCnt] = useState<keyof Scenes>("1");

    const nextScene = () => {
        setSceneCnt((prev) => {
            const newVal = Number(prev) + 1;
            if (Object.keys(scene).includes(`${newVal}`)) {
                return `${newVal}` as keyof Scenes;
            }
            return prev;
        });
    };
    useEffect(() => {
        setButtonTitle(scene[sceneCnt].buttonTitle);
        setStacyMessage(scene[sceneCnt].stacyMessage);
    }, [sceneCnt]);
    useEffect(() => {
        if (sceneCnt === "1") {
            setStacyAction({
                animation: "wave",
                repetition: 1,
            });
        } else if (sceneCnt === "2") {
            setStacyAction({
                animation: "rope",
                repetition: 2,
            });
        } else if (sceneCnt === "3") {
            setStacyAction({
                animation: "swingdance",
                repetition: 2,
            });
        } else if (sceneCnt === "4") {
            setStacyAction({
                animation: "pockets",
                repetition: 2,
            });
        } else if (sceneCnt === "5") {
            setStacyAction({
                animation: "golf",
                repetition: 1,
            });
        } else if (sceneCnt === "6") {
            setTimeout(() => {
                router.navigate("/cake");
            }, 1500);
        }
    }, [sceneCnt]);
    return (
        <>
            <ThemedView style={styles.messageContainer}>
                <ThemedText style={styles.messageText}>
                    Stacy: {stacyMessage}
                </ThemedText>
            </ThemedView>
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
                <fog args={[0xf1f1f1, 60, 100]} />
                <Suspense>
                    <Model performAction={stacyAction} />
                </Suspense>
                <mesh position={[-0.25, -2.5, -15]}>
                    <sphereGeometry args={[8, 32, 32]} />
                    <meshBasicMaterial color={0x9bffaf} />
                </mesh>
                <Floor />
            </Canvas>

            <ThemedView style={styles.actionButtonContainer}>
                {buttonTitle !== "" ? (
                    <Pressable onPress={nextScene} style={styles.button}>
                        <ThemedText style={styles.buttonText}>
                            {buttonTitle}
                        </ThemedText>
                    </Pressable>
                ) : (
                    ""
                )}
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        backgroundColor: "lightblue",
        padding: 12,
        alignItems: "center",
    },
    messageText: {
        textAlign: "center",
        maxWidth: 350,
    },
    actionButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        height: 100,
    },
    button: {
        backgroundColor: "pink",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        minWidth: 100,
        height: 50,
        justifyContent: "center",
    },
    buttonText: {
        textAlign: "center",
        fontWeight: "semibold",
    },
});

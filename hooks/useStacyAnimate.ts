import { useEffect, useState } from "react";
import {
    AnimationAction,
    AnimationClip,
    AnimationMixer,
    LoopRepeat,
} from "three";

export type StacyAnimations = {
    wave: AnimationClip;
    idle: AnimationClip;
    golf: AnimationClip;
    pockets: AnimationClip;
    swingdance: AnimationClip;
    rope: AnimationClip;
    jump: AnimationClip;
    react: AnimationClip;
};

export default function useStacyAnimate(
    gltf: any
): [
    AnimationMixer,
    AnimationAction,
    StacyAnimations,
    (animationName: keyof StacyAnimations, repetitions: number) => void
] {
    const [mixer, _] = useState(new AnimationMixer(gltf.scene));
    const [clip, setClip] = useState<AnimationAction>(
        mixer.clipAction(AnimationClip.findByName(gltf.animations, "idle"))
    );

    const fileAnimations = gltf.animations;
    const availableAnimations: StacyAnimations = {
        wave: AnimationClip.findByName(fileAnimations, "wave"),
        idle: AnimationClip.findByName(fileAnimations, "idle"),
        golf: AnimationClip.findByName(fileAnimations, "golf"),
        pockets: AnimationClip.findByName(fileAnimations, "pockets"),
        swingdance: AnimationClip.findByName(fileAnimations, "swingdance"),
        rope: AnimationClip.findByName(fileAnimations, "rope"),
        jump: AnimationClip.findByName(fileAnimations, "jump"),
        react: AnimationClip.findByName(fileAnimations, "react"),
    };

    const startClip = (
        animationName: keyof StacyAnimations,
        repetitions: number
    ) => {
        const anim = AnimationClip.findByName(fileAnimations, animationName);
        setClip(mixer.clipAction(anim).setLoop(LoopRepeat, repetitions));
    };
    const goIdle = () => {
        const anim = AnimationClip.findByName(fileAnimations, "idle");
        setClip(mixer.clipAction(anim));
    };

    useEffect(() => {
        mixer.addEventListener("finished", function (e) {
            goIdle();
        });
    }, []);
    return [mixer, clip, availableAnimations, startClip];
}

import { useState, useEffect, useRef, useCallback } from 'react';

type RobotCraneProps = {
    swingDeg: number;
    liftMm: number;
    elbowDeg: number;
    wristDeg: number;
    gripperMm: number;
}

type Direction = "up" | "down";

export function useCraneState(initialState: RobotCraneProps = {
    swingDeg: 0,
    liftMm: 0,
    elbowDeg: 0,
    wristDeg: 0,
    gripperMm: 0
}) {
    const [state, setState] = useState<RobotCraneProps>(initialState);
    const lastUpdateTime = useRef<number>(0);
    const DEGREES_PER_SECOND = 45; // degrees per second rotation
    const WRIST_DEGREES_PER_SECOND = 85; // degrees per second rotation
    
    const LIFT_PER_SECOND = 500 // mm per second
    const liftDirection = useRef<Direction>("up")

    const updateState = useCallback((time: number) => {
        const deltaTime = (time - lastUpdateTime.current) / 1000; // Convert to seconds
        lastUpdateTime.current = time;

        const nextLift = (lift: number) => {
            const adjustment = (LIFT_PER_SECOND * deltaTime);
            if (lift >= 2000) {
                liftDirection.current = "down"    
            } else if (lift <= 350) {
                liftDirection.current = "up"
            }
            return liftDirection.current === "up" ? lift + adjustment : lift - adjustment;
        }

        setState(prevState => ({
            ...prevState,
            liftMm: nextLift(prevState.liftMm) ,
            swingDeg: (prevState.swingDeg + (DEGREES_PER_SECOND * deltaTime)) % 360,
            elbowDeg: (prevState.swingDeg + (DEGREES_PER_SECOND * deltaTime)) % 360,
            wristDeg: (prevState.swingDeg + (WRIST_DEGREES_PER_SECOND * deltaTime)) % 360,
        }));
    }, []);

    return {
        state,
        updateState
    };
} 
'use client';

import { CraneDimensions, CraneState } from "@/types/crane"
import { FC, useCallback } from "react"
import RobotCrane from "@/components/robot/RobotCrane";
import CraneControls from "@/components/controls/CraneControls";
import { useCraneState } from "@/state/robot/useCraneState";
import { useSocket } from "@/state/robot/useSocket";

type Props = {
    id: string,
    state: CraneState,
    dimensions: CraneDimensions
}

const RobotCraneScene: FC<Props> = ({ id, state, dimensions }) => {
    const [sceneState, dispatch] = useCraneState({ user: [], crane: state });
    
    // Memoize the socket updater to prevent recreation
    const socketUpdater = useCallback(() => {
        return useSocket(id, dispatch);
    }, [id, dispatch]);

    const updater = socketUpdater();

    return (
        <>
            <RobotCrane state={sceneState.crane} dimensions={dimensions} />
            <div className="fixed bottom-4 right-4">
                <CraneControls dispatch={updater} />
            </div>
        </>
    )
};


export default RobotCraneScene;
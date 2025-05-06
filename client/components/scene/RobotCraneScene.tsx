'use client';

import { CraneDimensions, CraneState } from "@/types/crane"
import { FC } from "react"
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
    const [sceneState, dispatch] = useCraneState({ user: [], crane: state, debugMode: false })
    const updater = useSocket(id, dispatch);
    return (
        <>
            <RobotCrane state={sceneState.crane} dimensions={dimensions} debugMode={sceneState.debugMode} />
            <div className="fixed bottom-4 right-4 max-w-2/6 backdrop-blur-xs border-accent-content border-1 rounded-sm">
                <CraneControls dispatch={updater} toggleDebug={(payload) => dispatch({ type: "debug-mode", payload })} />
            </div>
        </>
    )
};


export default RobotCraneScene;
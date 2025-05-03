import { CraneSceneState, CraneState } from '@/types/crane';
import { useReducer } from 'react';
import { CraneAction } from '@/state/robot/actions';

const reducer = (state: CraneSceneState, action: CraneAction): CraneSceneState => {
    switch (action.type) {
        case 'update':
            return {
                ...state,
                ...{ crane: action.payload }
            }
        default:
            return state
    }
}

export const useCraneState = (initialState: CraneSceneState) => useReducer(reducer, initialState);

// export function useCraneState(initialState: RobotCraneProps = {
//     swingDeg: 0,
//     liftMm: 1200,
//     elbowDeg: 0,
//     wristDeg: 0,
//     gripperMm: 0
// }) {
//     const [state, setState] = useState<RobotCraneProps>(initialState);
//     const lastUpdateTime = useRef<number>(0);
//     const DEGREES_PER_SECOND = 45; // degrees per second rotation
//     const WRIST_DEGREES_PER_SECOND = 85; // degrees per second rotation
    
//     const LIFT_PER_SECOND = 500 // mm per second
//     const liftDirection = useRef<Direction>("up")

//     const updateState = useCallback((time: number) => {
//         const deltaTime = (time - lastUpdateTime.current) / 1000; // Convert to seconds
//         lastUpdateTime.current = time;

//         const nextLift = (lift: number) => {
//             const adjustment = (LIFT_PER_SECOND * deltaTime);
//             if (lift >= 1900) {
//                 liftDirection.current = "down"    
//             } else if (lift <= 350) {
//                 liftDirection.current = "up"
//             }
//             return liftDirection.current === "up" ? lift + adjustment : lift - adjustment;
//         }

//         setState(prevState => ({
//             ...prevState,
//             liftMm: nextLift(prevState.liftMm) ,
//             swingDeg: (prevState.swingDeg + (DEGREES_PER_SECOND * deltaTime)) % 360,
//             elbowDeg: (prevState.swingDeg + (DEGREES_PER_SECOND * deltaTime)) % 360,
//             wristDeg: (prevState.swingDeg + (WRIST_DEGREES_PER_SECOND * deltaTime)) % 360,
//         }));
//     }, []);

//     return {
//         state,
//         updateState
//     };
// } 
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
        case 'debug-mode': {
            return {
                ...state,
                ...{ debugMode: action.payload }
            }
        }
        case 'connect': {
            return {
                ...state,
                ...{ connected: action.payload }
            }
        }
        default:
            return state
    }
}

export const useCraneState = (initialState: CraneState) => useReducer(reducer, {
    connected: true, // default to true to avoid flicker
    crane: initialState,
    users: [],
    debugMode: false
});
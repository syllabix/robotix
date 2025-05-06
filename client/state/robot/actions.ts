import { CraneState } from "@/types/crane";

export type Command =
    "LiftUp" |
    "LiftDown" |
    "SwingLeft" |
    "SwingRight" |
    "ElbowLeft" |
    "ElbowRight" |
    "WristLeft" |
    "WristRight" |
    "GripperOpen" |
    "GripperClose" |
    "ToggleDebugMode"

type Connect = {
    type: "connect";
    payload: boolean;
};

type UserJoin = {
    type: "join";
    payload: string;
};

type UserLeave = {
    type: "leave";
    payload: string;
};

type CommandAction = {
    type: "command";
    payload: Command[];
};

type CraneStateUpdate = {
    type: "update",
    payload: CraneState
}

type MoveCrane = {
    type: "move",
    payload: { x: number, y: number, z: number }
}

type ToggleDebugMode = {
    type: "debug-mode"
    payload: boolean
}

export type CraneAction =
    | Connect
    | UserJoin
    | UserLeave
    | CommandAction
    | CraneStateUpdate
    | ToggleDebugMode
    | MoveCrane;
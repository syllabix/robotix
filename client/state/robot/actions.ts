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
    "GripperClose"

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

export type CraneAction =
    | Connect
    | UserJoin
    | UserLeave
    | CommandAction
    | CraneStateUpdate;
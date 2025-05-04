'use client'

import { FC, useEffect, useState } from "react";
import { Updater } from "@/state/robot/useSocket";
import { Command } from "@/state/robot/actions";
import CoordinateInput from "./CoordinateInput";

const CraneControls: FC<{ dispatch: Updater }> = ({ dispatch }) => {
    const [activeCommands, setActiveCommands] = useState<Set<Command>>(new Set());
    const [gripperMode, setGripperMode] = useState<'open' | 'close'>('close');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (typeof e.key === "undefined") {
                return;
            }
            let command: Command | null = null;
            switch (e.key.toLowerCase()) {
                case 'w':
                    command = "LiftUp";
                    break;
                case 's':
                    command = "LiftDown";
                    break;
                case 'a':
                    command = "SwingLeft";
                    break;
                case 'd':
                    command = "SwingRight";
                    break;
                case 'j':
                    command = "ElbowRight";
                    break;
                case 'l':
                    command = "ElbowLeft";
                    break;
                case 'i':
                    command = "WristRight";
                    break;
                case 'k':
                    command = "WristLeft";
                    break;
                case ' ':
                    command = gripperMode === 'open' ? "GripperOpen" : "GripperClose";
                    break;
            }

            if (command) {
                setActiveCommands(prev => {
                    const newCommands = new Set(prev);
                    newCommands.add(command!);
                    return newCommands;
                });
            }

            // Toggle gripper mode with command key (meta key)
            if (e.key === 'Meta' || e.key === 'Control') {
                setGripperMode(prev => prev === 'open' ? 'close' : 'open');
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (typeof e.key === "undefined") {
                return;
            }
            let command: Command | null = null;
            switch (e.key.toLowerCase()) {
                case 'w':
                    command = "LiftUp";
                    break;
                case 's':
                    command = "LiftDown";
                    break;
                case 'a':
                    command = "SwingLeft";
                    break;
                case 'd':
                    command = "SwingRight";
                    break;
                case 'j':
                    command = "ElbowRight";
                    break;
                case 'l':
                    command = "ElbowLeft";
                    break;
                case 'i':
                    command = "WristRight";
                    break;
                case 'k':
                    command = "WristLeft";
                    break;
                case ' ':
                    command = gripperMode === 'open' ? "GripperOpen" : "GripperClose";
                    break;
            }

            if (command) {
                setActiveCommands(prev => {
                    const newCommands = new Set(prev);
                    newCommands.delete(command!);
                    return newCommands;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gripperMode]);

    useEffect(() => {
        if (activeCommands.size > 0) {
            dispatch({
                type: 'command',
                payload: Array.from(activeCommands)
            });
        }
    }, [activeCommands, dispatch]);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="text-sm text-gray-500">Controls:</div>
            
            {/* Main Movement Controls */}
            <div className="grid grid-cols-3 gap-2">
                {/* Lift Controls */}
                <div className="col-start-2">
                    <div className="flex flex-col items-center gap-1">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${activeCommands.has("LiftUp")
                            ? "bg-blue-100 border-blue-300"
                            : "bg-gray-100 border-gray-200"
                            }`}>W</kbd>
                        <div className="text-xs text-gray-500">Lift Up</div>
                    </div>
                </div>
                <div className="col-start-2">
                    <div className="flex flex-col items-center gap-1">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${activeCommands.has("LiftDown")
                            ? "bg-blue-100 border-blue-300"
                            : "bg-gray-100 border-gray-200"
                            }`}>S</kbd>
                        <div className="text-xs text-gray-500">Lift Down</div>
                    </div>
                </div>

                {/* Swing Controls */}
                <div className="col-start-1">
                    <div className="flex flex-col items-center gap-1">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${activeCommands.has("SwingLeft")
                            ? "bg-blue-100 border-blue-300"
                            : "bg-gray-100 border-gray-200"
                            }`}>A</kbd>
                        <div className="text-xs text-gray-500">Swing Left</div>
                    </div>
                </div>
                <div className="col-start-3">
                    <div className="flex flex-col items-center gap-1">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${activeCommands.has("SwingRight")
                            ? "bg-blue-100 border-blue-300"
                            : "bg-gray-100 border-gray-200"
                            }`}>D</kbd>
                        <div className="text-xs text-gray-500">Swing Right</div>
                    </div>
                </div>
            </div>

            {/* Arm Controls */}
            <div className="grid grid-cols-2 gap-4">
                {/* Elbow Controls */}
                <div className="flex flex-col gap-2">
                    <div className="text-xs text-gray-500">Elbow:</div>
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center gap-1">
                            <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${activeCommands.has("ElbowLeft")
                                ? "bg-blue-100 border-blue-300"
                                : "bg-gray-100 border-gray-200"
                                }`}>L</kbd>
                            <div className="text-xs text-gray-500">Left</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${activeCommands.has("ElbowRight")
                                ? "bg-blue-100 border-blue-300"
                                : "bg-gray-100 border-gray-200"
                                }`}>J</kbd>
                            <div className="text-xs text-gray-500">Right</div>
                        </div>
                    </div>
                </div>

                {/* Wrist Controls */}
                <div className="flex flex-col gap-2">
                    <div className="text-xs text-gray-500">Wrist:</div>
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center gap-1">
                            <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${activeCommands.has("WristLeft")
                                ? "bg-blue-100 border-blue-300"
                                : "bg-gray-100 border-gray-200"
                                }`}>K</kbd>
                            <div className="text-xs text-gray-500">Left</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${activeCommands.has("WristRight")
                                ? "bg-blue-100 border-blue-300"
                                : "bg-gray-100 border-gray-200"
                                }`}>I</kbd>
                            <div className="text-xs text-gray-500">Right</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gripper Controls */}
            <div className="flex flex-col gap-2">
                <div className="text-xs text-gray-500">Gripper:</div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 text-xs font-semibold rounded ${
                            gripperMode === 'open' 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                        }`}>
                            {gripperMode === 'open' ? 'Open' : 'Close'}
                        </div>
                        <div className="text-xs text-gray-500">
                            (Toggle with ⌘/Ctrl)
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${activeCommands.has("GripperOpen") || activeCommands.has("GripperClose")
                            ? "bg-blue-100 border-blue-300"
                            : "bg-gray-100 border-gray-200"
                            }`}>Space</kbd>
                        <div className="text-xs text-gray-500">
                            (Hold to activate)
                        </div>
                    </div>
                </div>
            </div>

            <div className="divider"></div>
            
            <CoordinateInput dispatch={dispatch} />
        </div>
    );
};

export default CraneControls;
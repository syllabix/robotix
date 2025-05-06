'use client'

import { FC, useEffect, useState } from "react";
import { Updater } from "@/state/robot/useSocket";
import { Command } from "@/state/robot/actions";
import CoordinateInput from "./CoordinateInput";

type Props = {
    dispatch: Updater,
    toggleDebug: (on: boolean) => void
}

const CraneControls: FC<Props> = ({ dispatch, toggleDebug }) => {
    const [activeCommands, setActiveCommands] = useState<Set<Command>>(new Set());
    const [gripperMode, setGripperMode] = useState<'open' | 'close'>('close');

    const commandForKey = (e: KeyboardEvent) => {
        let command: Command | null = null;
        if (typeof e.key === "undefined") {
            return command;
        }

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

        return command
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const command = commandForKey(e);

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
            const command = commandForKey(e);

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
        <div className="flex flex-col gap-2 p-4">
            <div className="text-sm text-base-content/70">Controls:</div>

            {/* Main Movement Controls */}
            <div className="grid grid-cols-3 gap-2">
                {/* Lift Controls */}
                <div className="col-start-2">
                    <div className="flex flex-col items-center gap-1">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-base-content border rounded ${activeCommands.has("LiftUp")
                            ? "bg-primary border-base-300"
                            : "bg-base-200 border-base-300"
                            }`}>W</kbd>
                        <div className="text-xs text-base-content/70">Lift Up</div>
                    </div>
                </div>

                {/* Swing Controls */}
                <div className="col-start-1">
                    <div className="flex flex-col items-center gap-1">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-base-content border rounded ${activeCommands.has("SwingLeft")
                            ? "bg-primary border-base-300"
                            : "bg-base-200 border-base-300"
                            }`}>A</kbd>
                        <div className="text-xs text-base-content/70">Swing Left</div>
                    </div>
                </div>
                <div className="col-start-2">
                    <div className="flex flex-col items-center gap-1">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-base-content border rounded ${activeCommands.has("LiftDown")
                            ? "bg-primary border-base-300"
                            : "bg-base-200 border-base-300"
                            }`}>S</kbd>
                        <div className="text-xs text-base-content/70">Lift Down</div>
                    </div>
                </div>
                <div className="col-start-3">
                    <div className="flex flex-col items-center gap-1">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-base-content border rounded ${activeCommands.has("SwingRight")
                            ? "bg-primary border-base-300"
                            : "bg-base-200 border-base-300"
                            }`}>D</kbd>
                        <div className="text-xs text-base-content/70">Swing Right</div>
                    </div>
                </div>
            </div>

            {/* Arm Controls */}
            <div className="grid grid-cols-5 gap-4">
                {/* Elbow Controls */}
                <div className="col-start-2 flex flex-col gap-2">
                    <div className="text-xs text-base-content/70">Elbow:</div>
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center gap-1">
                            <kbd className={`px-2 py-1 text-xs font-semibold text-base-content border rounded ${activeCommands.has("ElbowRight")
                                ? "bg-primary border-base-300"
                                : "bg-base-200 border-base-300"
                                }`}>J</kbd>
                            <div className="text-xs text-base-content/70">Left</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <kbd className={`px-2 py-1 text-xs font-semibold text-base-content border rounded ${activeCommands.has("ElbowLeft")
                                ? "bg-primary border-base-300"
                                : "bg-base-200 border-base-300"
                                }`}>L</kbd>
                            <div className="text-xs text-base-content/70">Right</div>
                        </div>
                    </div>
                </div>

                {/* Wrist Controls */}
                <div className="col-start-4 flex flex-col gap-2">
                    <div className="text-xs text-base-content/70">Wrist:</div>
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center gap-1">
                            <kbd className={`px-2 py-1 text-xs font-semibold text-base-content border rounded ${activeCommands.has("WristRight")
                                ? "bg-primary border-base-300"
                                : "bg-base-200 border-base-300"
                                }`}>I</kbd>
                            <div className="text-xs text-base-content/70">Left</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <kbd className={`px-2 py-1 text-xs font-semibold text-base-content border rounded ${activeCommands.has("WristLeft")
                                ? "bg-primary border-base-300"
                                : "bg-base-200 border-base-300"
                                }`}>K</kbd>
                            <div className="text-xs text-base-content/70">Right</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gripper Controls */}
            <div className="flex flex-col gap-2">
                <div className="text-xs text-base-content/70">Gripper:</div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 text-xs font-semibold rounded ${gripperMode === 'open'
                            ? "bg-success text-success-content"
                            : "bg-error text-error-content"
                            }`}>
                            {gripperMode === 'open' ? 'Open' : 'Close'}
                        </div>
                        <div className="text-xs text-base-content/70">
                            (Toggle with ⌘/Ctrl)
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className={`px-2 py-1 text-xs font-semibold text-base-content border rounded ${activeCommands.has("GripperOpen") || activeCommands.has("GripperClose")
                            ? "bg-primary border-base-300"
                            : "bg-base-200 border-base-300"
                            }`}>Space</kbd>
                        <div className="text-xs text-base-content/70">
                            (Hold to activate)
                        </div>
                    </div>
                </div>
            </div>

            <div className="divider my-0"></div>
            <CoordinateInput dispatch={dispatch} />
            <div className="divider my-0"></div>
            <div className="flex items-center  justify-between gap-2">
                <div className="text-xs text-base-content/70">Debug Mode:</div>
                <input
                    type="checkbox"
                    className="toggle toggle-primary toggle-sm"
                    onChange={(e) => toggleDebug(e.target.checked)}
                />
            </div>
        </div>
    );
};

export default CraneControls;
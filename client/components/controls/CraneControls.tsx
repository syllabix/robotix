'use client'

import { FC, useEffect, useState } from "react";
import { Updater } from "@/state/robot/useSocket";
import { Command } from "@/state/robot/actions";
import CoordinateInput from "./CoordinateInput";

type Props = {
    dispatch: Updater,
    toggleDebug: (on: boolean) => void
}

type ControlButtonProps = {
    command: Command;
    label: string;
    activeCommands: Set<Command>;
    onCommandChange: (command: Command, active: boolean) => void;
}

const ControlButton: FC<ControlButtonProps> = ({ command, label, activeCommands, onCommandChange }) => {
    const isActive = activeCommands.has(command);

    const handleMouseDown = () => {
        onCommandChange(command, true);
    };

    const handleMouseUp = () => {
        onCommandChange(command, false);
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <kbd 
                className={`px-2 py-1 text-xs font-semibold text-base-content border rounded cursor-pointer select-none ${
                    isActive ? "bg-primary border-base-300" : "bg-base-200 border-base-300"
                }`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {label}
            </kbd>
            <div className="text-xs text-base-content/70">{label}</div>
        </div>
    );
};

const CraneControls: FC<Props> = ({ dispatch, toggleDebug }) => {
    const [activeCommands, setActiveCommands] = useState<Set<Command>>(new Set());
    const [gripperMode, setGripperMode] = useState<'open' | 'close'>('close');

    const handleCommandChange = (command: Command, active: boolean) => {
        setActiveCommands(prev => {
            const newCommands = new Set(prev);
            if (active) {
                newCommands.add(command);
            } else {
                newCommands.delete(command);
            }
            return newCommands;
        });
    };

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
                handleCommandChange(command, true);
            }

            // Toggle gripper mode with command key (meta key)
            if (e.key === 'Meta' || e.key === 'Control') {
                setGripperMode(prev => prev === 'open' ? 'close' : 'open');
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const command = commandForKey(e);

            if (command) {
                handleCommandChange(command, false);
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
                    <ControlButton
                        command="LiftUp"
                        label="W"
                        activeCommands={activeCommands}
                        onCommandChange={handleCommandChange}
                    />
                </div>

                {/* Swing Controls */}
                <div className="col-start-1">
                    <ControlButton
                        command="SwingLeft"
                        label="A"
                        activeCommands={activeCommands}
                        onCommandChange={handleCommandChange}
                    />
                </div>
                <div className="col-start-2">
                    <ControlButton
                        command="LiftDown"
                        label="S"
                        activeCommands={activeCommands}
                        onCommandChange={handleCommandChange}
                    />
                </div>
                <div className="col-start-3">
                    <ControlButton
                        command="SwingRight"
                        label="D"
                        activeCommands={activeCommands}
                        onCommandChange={handleCommandChange}
                    />
                </div>
            </div>

            {/* Arm Controls */}
            <div className="grid grid-cols-5 gap-4">
                {/* Elbow Controls */}
                <div className="col-start-2 flex flex-col gap-2">
                    <div className="text-xs text-base-content/70">Elbow:</div>
                    <div className="flex gap-2">
                        <ControlButton
                            command="ElbowRight"
                            label="J"
                            activeCommands={activeCommands}
                            onCommandChange={handleCommandChange}
                        />
                        <ControlButton
                            command="ElbowLeft"
                            label="L"
                            activeCommands={activeCommands}
                            onCommandChange={handleCommandChange}
                        />
                    </div>
                </div>

                {/* Wrist Controls */}
                <div className="col-start-4 flex flex-col gap-2">
                    <div className="text-xs text-base-content/70">Wrist:</div>
                    <div className="flex gap-2">
                        <ControlButton
                            command="WristRight"
                            label="I"
                            activeCommands={activeCommands}
                            onCommandChange={handleCommandChange}
                        />
                        <ControlButton
                            command="WristLeft"
                            label="K"
                            activeCommands={activeCommands}
                            onCommandChange={handleCommandChange}
                        />
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
                        <kbd 
                            className={`px-2 py-1 text-xs font-semibold text-base-content border rounded cursor-pointer select-none ${
                                activeCommands.has("GripperOpen") || activeCommands.has("GripperClose")
                                    ? "bg-primary border-base-300"
                                    : "bg-base-200 border-base-300"
                            }`}
                            onMouseDown={() => handleCommandChange(gripperMode === 'open' ? "GripperOpen" : "GripperClose", true)}
                            onMouseUp={() => handleCommandChange(gripperMode === 'open' ? "GripperOpen" : "GripperClose", false)}
                            onMouseLeave={() => handleCommandChange(gripperMode === 'open' ? "GripperOpen" : "GripperClose", false)}
                        >
                            Space
                        </kbd>
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
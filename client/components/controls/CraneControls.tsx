'use client'

import { FC, useEffect, useState } from "react";
import { Updater, useSocket } from "@/state/robot/useSocket";
import { Command } from "@/state/robot/actions";

const CraneControls: FC<{ dispatch: Updater }> = ({ dispatch }) => {
    const [activeCommands, setActiveCommands] = useState<Set<Command>>(new Set());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            let command: Command | null = null;
            switch (e.key.toLowerCase()) {
                case 'w':
                    command = "LiftUp";
                    break;
                case 's':
                    command = "LiftDown";
                    break;
                case 'a':
                    command = "ElbowLeft";
                    break;
                case 'd':
                    command = "ElbowRight";
                    break;
            }

            if (command) {
                setActiveCommands(prev => {
                    const newCommands = new Set(prev);
                    newCommands.add(command!);
                    return newCommands;
                });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            let command: Command | null = null;
            switch (e.key.toLowerCase()) {
                case 'w':
                    command = "LiftUp";
                    break;
                case 's':
                    command = "LiftDown";
                    break;
                case 'a':
                    command = "ElbowLeft";
                    break;
                case 'd':
                    command = "ElbowRight";
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
    }, []);

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
            <div className="text-sm text-gray-500">Controls:</div>
            <div className="grid grid-cols-3 gap-2">
                <div className="col-start-2">
                    <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${
                        activeCommands.has("LiftUp") 
                            ? "bg-blue-100 border-blue-300" 
                            : "bg-gray-100 border-gray-200"
                    }`}>W</kbd>
                </div>
                <div className="col-start-1">
                    <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${
                        activeCommands.has("ElbowLeft") 
                            ? "bg-blue-100 border-blue-300" 
                            : "bg-gray-100 border-gray-200"
                    }`}>A</kbd>
                </div>
                <div className="col-start-2">
                    <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${
                        activeCommands.has("LiftDown") 
                            ? "bg-blue-100 border-blue-300" 
                            : "bg-gray-100 border-gray-200"
                    }`}>S</kbd>
                </div>
                <div className="col-start-3">
                    <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 border rounded ${
                        activeCommands.has("ElbowRight") 
                            ? "bg-blue-100 border-blue-300" 
                            : "bg-gray-100 border-gray-200"
                    }`}>D</kbd>
                </div>
            </div>
        </div>
    );
};

export default CraneControls;
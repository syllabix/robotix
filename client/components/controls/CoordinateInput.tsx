'use client'

import { FC, useState } from "react";
import { Updater } from "@/state/robot/useSocket";

const CoordinateInput: FC<{ dispatch: Updater }> = ({ dispatch }) => {
    const [coordinates, setCoordinates] = useState({
        x: '800',
        y: '800',
        z: '500'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only allow numeric values
        if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
            setCoordinates(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const x = parseFloat(coordinates.x);
        const y = parseFloat(coordinates.y);
        const z = parseFloat(coordinates.z);
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
            dispatch({
                type: 'move',
                payload: { x, y, z: -z } // need to invert the z coordinate for three.js layout
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-control">
            <div className="text-sm font-medium mb-2">Move to Coordinates</div>
            <div className="flex items-end gap-2">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text mr-2">X</span>
                    </label>
                    <input
                        type="text"
                        name="x"
                        value={coordinates.x}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-16"
                        placeholder="0"
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text mr-2">Y</span>
                    </label>
                    <input
                        type="text"
                        name="y"
                        value={coordinates.y}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-16"
                        placeholder="0"
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text mr-2">Z</span>
                    </label>
                    <input
                        type="text"
                        name="z"
                        value={coordinates.z}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-16"
                        placeholder="0"
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                >
                    Move
                </button>
            </div>
        </form>
    );
};

export default CoordinateInput; 
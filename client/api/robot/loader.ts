import { ApiError } from "next/dist/server/api-utils";
import { Result } from "typescript-result";
import Client from "@/api/client";
import { CraneDimensions } from "@/types/crane";

export const loadCraneDimensions = async (id: string) => {
    try {
        let response = await Client.get<CraneDimensions>(`/v1/robot/${id}/dimensions`);
        return Result.ok(response.data);
    } catch (e) {
        let err = e as ApiError;
        return Result.error(err.message);
    }
}
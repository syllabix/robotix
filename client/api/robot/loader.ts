import { ApiError } from "next/dist/server/api-utils";
import { Result } from "typescript-result";
import Client from "@/api/client";
import { CraneDetails } from "@/types/crane";

export const loadCrane = async (id: string) => {
    try {
        let response = await Client.get<CraneDetails>(`/v1/robot/${id}`);
        return Result.ok(response.data);
    } catch (e) {
        let err = e as ApiError;
        return Result.error(err.message);
    }
}

export const loadAll = async () => {
    try {
        let response = await Client.get<Array<CraneDetails>>(`/v1/robot`);
        return Result.ok(response.data);
    } catch (e) {
        let err = e as ApiError;
        return Result.error(err.message);
    }
}
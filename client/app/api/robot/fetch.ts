import useSWR from "swr"
import Client from "@/app/api/client"

export interface CraneDimensions {
    // Base dimensions
    baseRadius: number;        // Radius of the base cylinder
    baseHeight: number;        // Height of the base cylinder
    columnHeight: number;      // Total height of the column
    columnWidth: number;       // Width of the column truss
    
    // Arm dimensions
    upperArmLength: number;   // Length of the upper arm
    upperArmWidth: number;    // Width of the upper arm truss
    lowerArmLength: number;   // Length of the lower arm
    lowerArmWidth: number;    // Width of the lower arm truss
    
    // Joint dimensions
    swingJointRadius: number; // Radius of the swing joint
    liftJointHeight: number;  // Height of the lift joint
    elbowJointRadius: number; // Radius of the elbow joint
    wristJointRadius: number; // Radius of the wrist joint
    
    // Gripper dimensions
    gripperLength: number;     // Length of the gripper
    gripperWidth: number;      // Width of the gripper
    gripperMaxOpen: number;   // Maximum opening of the gripper
    wristExtensionLength: number; // Length of the fixed wrist extension
}

export const useCraneStateLoader = (id: string) => {
    const { data, error } = useSWR(
        `/v1/robot/${id}`,
        (url) => Client.get<CraneDimensions>(url)
    );

    return {
        data: data?.data || {} as CraneDimensions,
        error
    }
}
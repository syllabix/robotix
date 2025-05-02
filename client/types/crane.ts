
export type CraneDimensions = {
    // Base dimensions
    baseHeight: number;           // Height of the base cylinder
    baseRadiusTop: number;        // Radius of the base cylinder top
    baseRadiusBottom: number;     // Radius of the base cylinder bottom

    columnHeight: number;         // Total height of the column
    columnWidth: number;          // Width of the column truss
    columnThickness: number;      // Thickness of the column truss

    // Arm dimensions
    upperArmLength: number;    // Length of the upper arm
    upperArmWidth: number;     // Width of the upper arm truss
    upperArmThickness: number; // Thickness of the upper arm truss

    lowerArmLength: number;   // Length of the lower arm
    lowerArmWidth: number;    // Width of the lower arm truss
    lowerArmThickness: number; // Thickness of the lower arm truss

    // Joint dimensions
    swingJointHeight: number; // Height of the swing joint
    swingJointRadius: number; // Radius of the swing joint

    liftJointHeight: number; // Height of the lift joint
    liftJointRadius: number; // Radius of the lift joint

    elbowJointHeight: number; // Height of the elbow joint
    elbowJointRadius: number; // Radius of the elbow joint

    wristJointRadius: number; // Radius of the wrist joint
    wristJointHeight: number; // Height of the wrist joint

    // Gripper dimensions
    gripperLength: number;     // Length of the gripper
    gripperWidth: number;      // Width of the gripper
    gripperThickness: number;      // Thickness of the gripper

    gripperMaxOpen: number;   // Maximum opening of the gripper
    wristExtensionLength: number; // Length of the fixed wrist extension
}

export type CraneState = {
    swingDeg: number;
    liftMm: number;
    elbowDeg: number;
    wristDeg: number;
    gripperMm: number;
}
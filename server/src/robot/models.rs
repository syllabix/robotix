use serde::{Deserialize, Serialize};

use super::crane::ID;

#[derive(PartialEq, Eq, Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CraneState {
    pub swing_deg: i64,
    pub lift_mm: i64,
    pub elbow_deg: i64,
    pub wrist_deg: i64,
    pub gripper_mm: i64,
}

impl Default for CraneState {
    fn default() -> Self {
        Self {
            swing_deg: 0,
            lift_mm: 100,
            elbow_deg: 0,
            wrist_deg: 0,
            gripper_mm: 90,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CraneDimensions {
    // Base dimensions
    pub base_height: f64,        // Height of the base cylinder
    pub base_radius_top: f64,    // Radius of the base cylinder
    pub base_radius_bottom: f64, // Radius of the base cylinder

    pub column_height: f64,    // Total height of the column
    pub column_width: f64,     // Width of the column truss
    pub column_thickness: f64, // Thickness of the column truss

    // Arm dimensions
    pub upper_arm_length: f64,    // Length of the upper arm
    pub upper_arm_width: f64,     // Width of the upper arm truss
    pub upper_arm_thickness: f64, // Thickness of the upper arm truss

    pub lower_arm_length: f64,    // Length of the lower arm
    pub lower_arm_width: f64,     // Width of the lower arm truss
    pub lower_arm_thickness: f64, // Thickness of the lower arm truss

    // Joint dimensions
    pub swing_joint_radius: f64, // Radius of the swing joint
    pub swing_joint_height: f64, // Height of the swing joint

    pub lift_joint_height: f64, // Radius of the lift joint
    pub lift_joint_radius: f64, // Height of the lift joint

    pub elbow_joint_radius: f64, // Radius of the elbow joint
    pub elbow_joint_height: f64, // Radius of the elbow joint

    pub wrist_joint_radius: f64, // Radius of the wrist joint
    pub wrist_joint_height: f64, // Height of the wrist joint

    // Gripper dimensions
    pub gripper_length: f64,    // Length of the gripper
    pub gripper_width: f64,     // Width of the gripper
    pub gripper_thickness: f64, // Thickness of the gripper

    pub gripper_max_open: f64,       // Maximum opening of the gripper
    pub wrist_extension_length: f64, // Length of the fixed wrist extension
}

impl Default for CraneDimensions {
    fn default() -> Self {
        Self {
            // Base dimensions (in meters)
            base_height: 0.1,
            base_radius_bottom: 0.35,
            base_radius_top: 0.25,

            column_height: 2.0,
            column_width: 0.18,
            column_thickness: 0.05,

            // Arm dimensions (in meters)
            upper_arm_length: 0.75,
            upper_arm_width: 0.18,
            upper_arm_thickness: 0.04,

            lower_arm_length: 0.5,
            lower_arm_width: 0.12,
            lower_arm_thickness: 0.03,

            // Joint dimensions (in meters)
            swing_joint_height: 0.1,
            swing_joint_radius: 0.13,

            lift_joint_height: 0.08,
            lift_joint_radius: 0.09,

            elbow_joint_radius: 0.08,
            elbow_joint_height: 0.04,

            wrist_joint_radius: 0.07,
            wrist_joint_height: 0.02,

            // Gripper dimensions (in meters)
            gripper_length: 0.2,
            gripper_width: 0.08,
            gripper_thickness: 0.05,

            gripper_max_open: 0.1,
            wrist_extension_length: 0.15,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CraneLimits {
    pub swing_min: i64,
    pub swing_max: i64,
    pub lift_min: i64,
    pub lift_max: i64,
    pub elbow_min: i64,
    pub elbow_max: i64,
    pub wrist_min: i64,
    pub wrist_max: i64,
    pub gripper_min: i64,
    pub gripper_max: i64,
}

impl Default for CraneLimits {
    fn default() -> Self {
        Self {
            swing_min: 0,
            swing_max: 360,
            lift_min: 200,
            lift_max: 1800,
            elbow_min: 0,
            elbow_max: 0,
            wrist_min: 0,
            wrist_max: 0,
            gripper_min: 0,
            gripper_max: 200,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CraneDetails {
    pub id: ID,
    pub state: CraneState,
    pub dimensions: CraneDimensions,
}

impl Default for CraneDetails {
    fn default() -> Self {
        Self {
            id: String::from("robotix.v1"),
            state: Default::default(),
            dimensions: Default::default(),
        }
    }
}

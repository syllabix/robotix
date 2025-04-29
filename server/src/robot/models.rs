use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CraneState {
    pub swing_deg: f64,
    pub lift_mm: f64,
    pub elbow_deg: f64,
    pub wrist_deg: f64,
    pub gripper_mm: f64,
}

impl Default for CraneState {
    fn default() -> Self {
        Self {
            swing_deg: 0.0,
            lift_mm: 0.0,
            elbow_deg: 0.0,
            wrist_deg: 0.0,
            gripper_mm: 0.0,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CraneDimensions {
    // Base dimensions
    pub base_radius: f64,        // Radius of the base cylinder
    pub base_height: f64,        // Height of the base cylinder
    pub column_height: f64,      // Total height of the column
    pub column_width: f64,       // Width of the column truss
    
    // Arm dimensions
    pub upper_arm_length: f64,   // Length of the upper arm
    pub upper_arm_width: f64,    // Width of the upper arm truss
    pub lower_arm_length: f64,   // Length of the lower arm
    pub lower_arm_width: f64,    // Width of the lower arm truss
    
    // Joint dimensions
    pub swing_joint_radius: f64, // Radius of the swing joint
    pub lift_joint_height: f64,  // Height of the lift joint
    pub elbow_joint_radius: f64, // Radius of the elbow joint
    pub wrist_joint_radius: f64, // Radius of the wrist joint
    
    // Gripper dimensions
    pub gripper_length: f64,     // Length of the gripper
    pub gripper_width: f64,      // Width of the gripper
    pub gripper_max_open: f64,   // Maximum opening of the gripper
    pub wrist_extension_length: f64, // Length of the fixed wrist extension
}

impl Default for CraneDimensions {
    fn default() -> Self {
        Self {
            // Base dimensions (in meters)
            base_radius: 0.5,
            base_height: 0.25,
            column_height: 2.0,
            column_width: 0.2,
            
            // Arm dimensions (in meters)
            upper_arm_length: 1.0,
            upper_arm_width: 0.18,
            lower_arm_length: 0.5,
            lower_arm_width: 0.12,
            
            // Joint dimensions (in meters)
            swing_joint_radius: 0.13,
            lift_joint_height: 0.08,
            elbow_joint_radius: 0.05,
            wrist_joint_radius: 0.07,
            
            // Gripper dimensions (in meters)
            gripper_length: 0.1,
            gripper_width: 0.05,
            gripper_max_open: 0.1,
            wrist_extension_length: 0.15,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CraneLimits {
    pub swing_min: f64,
    pub swing_max: f64,
    pub lift_min: f64,
    pub lift_max: f64,
    pub elbow_min: f64,
    pub elbow_max: f64,
    pub wrist_min: f64,
    pub wrist_max: f64,
    pub gripper_min: f64,
    pub gripper_max: f64,
}

impl Default for CraneLimits {
    fn default() -> Self {
        Self {
            swing_min: 0.0,
            swing_max: 360.0,
            lift_min: 0.0,
            lift_max: 2000.0,
            elbow_min: -90.0,
            elbow_max: 90.0,
            wrist_min: -90.0,
            wrist_max: 90.0,
            gripper_min: 0.0,
            gripper_max: 100.0,
        }
    }
} 
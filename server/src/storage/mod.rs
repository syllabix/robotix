use std::fs;
use std::path::Path;
use std::collections::HashMap;
use std::path::PathBuf;

use anyhow::{Context, Result};
use serde::Deserialize;

use crate::robot::crane::Crane;
use crate::robot::models::{CraneDimensions, CraneLimits};

#[derive(Debug, Deserialize)]
struct RobotConfig {
    id: String,
    base: BaseConfig,
    column: ColumnConfig,
    upper_arm: ArmConfig,
    lower_arm: ArmConfig,
    swing_joint: JointConfig,
    lift_joint: JointConfig,
    elbow_joint: JointConfig,
    wrist_joint: JointConfig,
    gripper: GripperConfig,
    limits: LimitsConfig,
}

#[derive(Debug, Deserialize)]
struct BaseConfig {
    height: f64,
    radius_bottom: f64,
    radius_top: f64,
}

#[derive(Debug, Deserialize)]
struct ColumnConfig {
    height: f64,
    width: f64,
    thickness: f64,
}

#[derive(Debug, Deserialize)]
struct ArmConfig {
    length: f64,
    width: f64,
    thickness: f64,
}

#[derive(Debug, Deserialize)]
struct JointConfig {
    radius: f64,
    height: f64,
}

#[derive(Debug, Deserialize)]
struct GripperConfig {
    length: f64,
    width: f64,
    thickness: f64,
    max_open: f64,
}

#[derive(Debug, Deserialize)]
struct LimitsConfig {
    swing_min: i64,
    swing_max: i64,
    lift_min: i64,
    lift_max: i64,
    elbow_min: i64,
    elbow_max: i64,
    wrist_min: i64,
    wrist_max: i64,
    gripper_min: i64,
    gripper_max: i64,
}

pub fn load_robot_configs(config_dir: &Path) -> Result<Vec<Crane>> {
    let mut cranes = Vec::new();
    
    // Read all .toml files in the config directory
    for entry in fs::read_dir(config_dir)? {
        let entry = entry?;
        let path = entry.path();
        
        if path.extension().and_then(|s| s.to_str()) == Some("toml") {
            let config = load_robot_config(&path)?;
            let crane = create_crane_from_config(config)?;
            cranes.push(crane);
        }
    }
    
    Ok(cranes)
}

fn load_robot_config(path: &Path) -> Result<RobotConfig> {
    let content = fs::read_to_string(path)
        .with_context(|| format!("Failed to read config file: {}", path.display()))?;
    
    toml::from_str(&content)
        .with_context(|| format!("Failed to parse config file: {}", path.display()))
}

fn create_crane_from_config(config: RobotConfig) -> Result<Crane> {
    let dimensions = CraneDimensions {
        base_height: config.base.height,
        base_radius_bottom: config.base.radius_bottom,
        base_radius_top: config.base.radius_top,
        column_height: config.column.height,
        column_width: config.column.width,
        column_thickness: config.column.thickness,
        upper_arm_length: config.upper_arm.length,
        upper_arm_width: config.upper_arm.width,
        upper_arm_thickness: config.upper_arm.thickness,
        lower_arm_length: config.lower_arm.length,
        lower_arm_width: config.lower_arm.width,
        lower_arm_thickness: config.lower_arm.thickness,
        swing_joint_radius: config.swing_joint.radius,
        swing_joint_height: config.swing_joint.height,
        lift_joint_radius: config.lift_joint.radius,
        lift_joint_height: config.lift_joint.height,
        elbow_joint_radius: config.elbow_joint.radius,
        elbow_joint_height: config.elbow_joint.height,
        wrist_joint_radius: config.wrist_joint.radius,
        wrist_joint_height: config.wrist_joint.height,
        gripper_length: config.gripper.length,
        gripper_width: config.gripper.width,
        gripper_thickness: config.gripper.thickness,
        gripper_max_open: config.gripper.max_open,
    };

    let limits = CraneLimits {
        swing_min: config.limits.swing_min,
        swing_max: config.limits.swing_max,
        lift_min: config.limits.lift_min,
        lift_max: config.limits.lift_max,
        elbow_min: config.limits.elbow_min,
        elbow_max: config.limits.elbow_max,
        wrist_min: config.limits.wrist_min,
        wrist_max: config.limits.wrist_max,
        gripper_min: config.limits.gripper_min,
        gripper_max: config.limits.gripper_max,
    };

    let crane = Crane::new(config.id, dimensions, limits);

    Ok(crane)
}

#[derive(Debug)]
pub struct Database {
    cranes: HashMap<String, Crane>,
}

impl Database {
    pub fn setup(config_dir: &str) -> Result<Self> {
        let path = PathBuf::from(config_dir);
        let cranes = load_robot_configs(&path)?;
        
        let mut crane_map = HashMap::new();
        for crane in cranes {
            crane_map.insert(crane.id.clone(), crane);
        }
        
        Ok(Self { cranes: crane_map })
    }
    
    pub fn get(&self, id: &str) -> Option<&Crane> {
        self.cranes.get(id)
    }

    pub fn get_all(&self) -> Vec<&Crane> {
        self.cranes.values().collect()
    }
}
use std::collections::HashSet;

use actix::{Message, MessageResponse, Recipient};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use super::{crane, models::{CraneDimensions, CraneState}, user};

#[derive(Message)]
#[rtype(result = "()")]
pub struct Connect {
    pub user: user::ID,
    pub addr: Recipient<Operation>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub user: user::ID,
}

#[derive(PartialEq, Eq, Hash, Debug, Clone, Serialize, Deserialize)]
pub enum Command {
    LiftUp,
    LiftDown,
    SwingLeft,
    SwingRight,
    ElbowLeft,
    ElbowRight,
    WristLeft,
    WristRight,
    GripperOpen,
    GripperClose,
}

#[derive(Eq, PartialEq, Debug, Clone, Serialize, Deserialize)]
pub struct Location {
    pub x: i64,
    pub y: i64,
    pub z: i64,
}

#[derive(Clone, Debug, thiserror::Error)]
pub enum KinematicError {
    #[error("the provided location is not reachable")]
    Unreachable
}

#[derive(Eq, PartialEq, Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum Action {
    Join { payload: user::ID },
    Leave { payload: user::ID },
    Move { payload: Location },
    Command { payload: HashSet<Command> },
    Update { payload: CraneState }
}

#[derive(Message, Serialize, Deserialize, Clone, Debug)]
#[rtype(result = "()")]
pub struct Operation {
    pub user_id: user::ID,
    pub action: Action,
    pub created_at: DateTime<Utc>,
}

impl Operation {
    pub fn new(user_id: user::ID, action: Action) -> Self {
        Self {
            user_id,
            action,
            created_at: Utc::now(),
        }
    }
}

#[derive(MessageResponse, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RobotCraneInfo {
    pub id: crane::ID,
    pub state: CraneState,
    pub dimensions: CraneDimensions,
}

#[derive(Message)]
#[rtype(result = "RobotCraneInfo")]
pub struct RobotCraneInfoRequest;

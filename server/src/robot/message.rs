use actix::{Message, Recipient};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use super::user;

#[derive(Message)]
#[rtype(result = "()")]
pub struct Connect {
    pub user: user::ID,
    pub addr: Recipient<Action>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub user: user::ID,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Command {
    LiftUp,
    LiftDown,
    ElbowLeft,
    ElbowRight,
    WristLeft,
    WristRight,
    GripperOpen,
    GripperClose,
}

#[derive(Message, Serialize, Clone, Debug)]
#[rtype(result = "()")]
pub struct Action {
    pub user_id: usize,
    pub command: Command,
    pub created_at: DateTime<Utc>,
}



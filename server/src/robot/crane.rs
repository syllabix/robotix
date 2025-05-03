use std::collections::{HashMap, HashSet};
use std::time::{Duration, Instant};

use actix::{Actor, AsyncContext, Context, Handler, Recipient};

use super::{
    message::{
        Action, Command, Connect, Disconnect, Operation, RobotCraneInfo, RobotCraneInfoRequest,
    },
    models::{CraneDimensions, CraneLimits, CraneState},
    user,
};

pub type ID = String;

const MOVEMENT_SPEED: Duration = Duration::from_millis(10);

#[derive(Debug, Clone)]
pub struct Crane {
    id: ID,
    state: CraneState,
    dimensions: CraneDimensions,
    limits: CraneLimits,
    recipients: HashMap<user::ID, Recipient<Operation>>,
    last_update: HashMap<Command, Instant>,
}

impl Crane {
    pub fn new(id: ID) -> Self {
        Crane {
            id,
            recipients: Default::default(),
            state: Default::default(),
            limits: Default::default(),
            dimensions: Default::default(),
            last_update: Default::default(),
        }
    }

    fn broadcast(&self, msg: Operation) {
        for (_, user) in self.recipients.iter() {
            user.do_send(msg.clone())
        }
    }

    fn can_move(&mut self, cmd: &Command) -> bool {
        let now = Instant::now();
        match self.last_update.get(cmd) {
            Some(last) => {
                if now.duration_since(*last) >= MOVEMENT_SPEED {
                    self.last_update.insert(cmd.clone(), now);
                    true
                } else {
                    false
                }
            },
            None => {
                self.last_update.insert(cmd.clone(), now);
                true
            },
        }        
    }

    fn process_commands(&mut self, commands: HashSet<Command>) -> CraneState {
        for cmd in commands {
            if !self.can_move(&cmd) {
                continue;
            }

            match cmd {
                Command::LiftUp => {
                    self.state.lift_mm = (self.state.lift_mm + 5).min(self.limits.lift_max);
                }
                Command::LiftDown => {
                    self.state.lift_mm = (self.state.lift_mm - 5).max(self.limits.lift_min);
                }
                Command::SwingRight => {
                    self.state.swing_deg = (self.state.swing_deg + 1) % 360;
                }
                Command::SwingLeft => {
                    self.state.swing_deg = (self.state.swing_deg - 1).rem_euclid(360);
                }
                Command::ElbowLeft => {
                    if self.limits.elbow_max == 0 {
                        self.state.elbow_deg = (self.state.elbow_deg + 1) % 360;
                    } else {
                        self.state.elbow_deg = (self.state.elbow_deg + 1).min(self.limits.elbow_max);
                    }
                }
                Command::ElbowRight => {
                    if self.limits.elbow_min == 0 {
                        self.state.elbow_deg = (self.state.elbow_deg - 1).rem_euclid(360);
                    } else {
                        self.state.elbow_deg = (self.state.elbow_deg - 1).max(self.limits.elbow_min);
                    }
                }
                Command::WristLeft => {
                    if self.limits.wrist_max == 0 {
                        self.state.wrist_deg = (self.state.wrist_deg + 1) % 360;
                    } else {
                        self.state.wrist_deg = (self.state.wrist_deg + 1).min(self.limits.wrist_max);
                    }
                }
                Command::WristRight => {
                    if self.limits.wrist_min == 0 {
                        self.state.wrist_deg = (self.state.wrist_deg - 1).rem_euclid(360);
                    } else {
                        self.state.wrist_deg = (self.state.wrist_deg - 1).max(self.limits.wrist_min);
                    }
                }
                Command::GripperOpen => {
                    self.state.gripper_mm = (self.state.gripper_mm + 2).min(self.limits.gripper_max);
                }
                Command::GripperClose => {
                    self.state.gripper_mm = (self.state.gripper_mm - 2).max(self.limits.gripper_min);
                }
            }
        }
        self.state.clone()
    }
}

impl Actor for Crane {
    type Context = Context<Self>;

    fn started(&mut self, _ctx: &mut Self::Context) {
        tracing::info!("robot crane starting up: name {}", self.id);
    }

    fn stopped(&mut self, _ctx: &mut Self::Context) {
        tracing::info!("robot crane stopped: name {}", self.id);
    }
}

impl Handler<Connect> for Crane {
    type Result = ();

    fn handle(&mut self, msg: Connect, _ctx: &mut Self::Context) -> Self::Result {
        tracing::info!("user {} connecting to robot crane {}", &msg.user, &self.id);
        self.recipients.insert(msg.user, msg.addr);
        let op = Operation::new(msg.user, Action::Join { payload: msg.user });
        self.broadcast(op);
    }
}

impl Handler<Disconnect> for Crane {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _ctx: &mut Self::Context) -> Self::Result {
        tracing::info!(
            "user {} disconnecting to robot crane {}",
            &msg.user,
            &self.id
        );
        self.recipients.remove(&msg.user);
        let op = Operation::new(msg.user, Action::Leave { payload: msg.user });
        self.broadcast(op);
    }
}

impl Handler<Operation> for Crane {
    type Result = ();

    fn handle(&mut self, msg: Operation, _ctx: &mut Self::Context) -> Self::Result {
        tracing::info!(
            "crane {} recieved the command {:?} from {}",
            self.id,
            msg.action,
            msg.user_id
        );

        match msg.action {
            Action::Command { payload } => {
                let state = self.process_commands(payload);
                let op = Operation::new(msg.user_id, Action::Update { payload: state });
                self.broadcast(op);
            }
            _ => tracing::warn!("robot action not implemented yet: {:?}", msg.action),
        }
    }
}

impl Handler<RobotCraneInfoRequest> for Crane {
    type Result = RobotCraneInfo;

    fn handle(&mut self, _msg: RobotCraneInfoRequest, _ctx: &mut Self::Context) -> Self::Result {
        return RobotCraneInfo {
            id: self.id.clone(),
            state: self.state.clone(),
            dimensions: self.dimensions.clone(),
        };
    }
}

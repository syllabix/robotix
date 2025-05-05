use std::collections::{HashMap, HashSet};
use std::f64::consts::PI;
use std::time::{Duration, Instant};

use actix::{Actor, AsyncContext, Context, Handler, Recipient};

use super::{
    message::{
        Action, Command, Connect, Disconnect, KinematicError, Location, Operation, RobotCraneInfo,
        RobotCraneInfoRequest,
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
            }
            None => {
                self.last_update.insert(cmd.clone(), now);
                true
            }
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
                        self.state.elbow_deg =
                            (self.state.elbow_deg + 1).min(self.limits.elbow_max);
                    }
                }
                Command::ElbowRight => {
                    if self.limits.elbow_min == 0 {
                        self.state.elbow_deg = (self.state.elbow_deg - 1).rem_euclid(360);
                    } else {
                        self.state.elbow_deg =
                            (self.state.elbow_deg - 1).max(self.limits.elbow_min);
                    }
                }
                Command::WristLeft => {
                    if self.limits.wrist_max == 0 {
                        self.state.wrist_deg = (self.state.wrist_deg + 1) % 360;
                    } else {
                        self.state.wrist_deg =
                            (self.state.wrist_deg + 1).min(self.limits.wrist_max);
                    }
                }
                Command::WristRight => {
                    if self.limits.wrist_min == 0 {
                        self.state.wrist_deg = (self.state.wrist_deg - 1).rem_euclid(360);
                    } else {
                        self.state.wrist_deg =
                            (self.state.wrist_deg - 1).max(self.limits.wrist_min);
                    }
                }
                Command::GripperOpen => {
                    self.state.gripper_mm =
                        (self.state.gripper_mm + 2).min(self.limits.gripper_max);
                }
                Command::GripperClose => {
                    self.state.gripper_mm =
                        (self.state.gripper_mm - 2).max(self.limits.gripper_min);
                }
            }
        }
        self.state.clone()
    }

    fn calculate_inverse_kinematics(
        &self,
        target: &Location,
    ) -> Result<CraneState, KinematicError> {
        // Convert all dimensions to millimeters for consistency
        let base_height_mm = (self.dimensions.base_height * 1000.) as f64;
        let upper_arm_mm = ((self.dimensions.upper_arm_length
            + self.dimensions.upper_arm_thickness)
            * 1000.0) as f64;
        let lower_arm_mm = ((self.dimensions.lower_arm_length
            + self.dimensions.lower_arm_thickness)
            * 1000.0) as f64;

        // Target position in millimeters
        let x = target.x as f64;
        let y = target.y as f64; // y is vertical
        let z = target.z as f64; // z is forward/backward

        // 1. Calculate vertical distance from base to target and clamp it within limits
        let y_offset = (self.dimensions.wrist_joint_height
            + self.dimensions.lower_arm_thickness
            + self.dimensions.elbow_joint_height
            + self.dimensions.upper_arm_thickness
            + self.dimensions.gripper_thickness)
            * 1000.;
        let dy = y + y_offset - base_height_mm;
        let lift_mm = dy
            .clamp(self.limits.lift_min as f64, self.limits.lift_max as f64)
            .round() as i64;

        let extension = lower_arm_mm;

        let mut total_extension = extension;
        if z > 0. {
            total_extension = -extension
        }
        if x < 0. {
            total_extension = -extension
        }

        let (wrist_x, wrist_z) = (x, z);
        tracing::info!("wrist coordinates distance: {} - {}", wrist_x, wrist_z);

        // 5. Calculate swing angle based on wrist position (not target position)
        let swing_rad = wrist_z.atan2(wrist_x - total_extension);
        let swing_deg = swing_rad.to_degrees().round() as i64;

        // 6. Calculate the distance from the base to the wrist position
        let wrist_r = (wrist_x.powi(2) + wrist_z.powi(2)).sqrt();
        let wrist_y = 0.0f64; // Since we're handling lift separately

        // 8. Calculate elbow angle using law of cosines
        let cos_angle_elbow = ((upper_arm_mm.powi(2) + lower_arm_mm.powi(2) - wrist_r.powi(2))
            / (2.0 * upper_arm_mm * lower_arm_mm))
            .max(-1.0)
            .min(1.0);
        let angle_elbow = f64::acos(cos_angle_elbow);
        let mut final_angle_elbow = angle_elbow;
        if x < 0. {
            final_angle_elbow = -angle_elbow
        }
        let elbow_deg = (180.0 - final_angle_elbow.to_degrees()).round() as i64;

        // 9. Calculate angle from base to wrist
        let angle_to_wrist = wrist_y.atan2(wrist_r);

        // 10. Calculate wrist angle to keep gripper level
        let wrist_deg = ((angle_to_wrist - angle_elbow).to_degrees().round() / 2.) as i64;

        // Wrap angles to [-180, 180] range
        let wrap_angle = |angle: i64| -> i64 { ((angle + 180) % 360 + 360) % 360 - 180 };

        let swing_deg = wrap_angle(swing_deg);
        let elbow_deg = wrap_angle(elbow_deg);
        let wrist_deg = wrap_angle(wrist_deg);

        Ok(CraneState {
            swing_deg,
            lift_mm,
            elbow_deg,
            wrist_deg,
            gripper_mm: self.state.gripper_mm, // Keep gripper position unchanged
        })
    }

    fn interpolate_to_state(
        &mut self,
        target_state: CraneState,
        user_id: user::ID,
        steps: usize,
        delay: Duration,
        ctx: &mut Context<Self>,
    ) {
        let current = self.state.clone();

        // Compute the difference for each field
        let delta = |start, end| (end - start) as f64 / steps as f64;

        let swing_step = delta(current.swing_deg, target_state.swing_deg);
        let lift_step = delta(current.lift_mm, target_state.lift_mm);
        let elbow_step = delta(current.elbow_deg, target_state.elbow_deg);
        let wrist_step = delta(current.wrist_deg, target_state.wrist_deg);
        let gripper_step = delta(current.gripper_mm, target_state.gripper_mm);

        for i in 1..=steps {
            let state = CraneState {
                swing_deg: (current.swing_deg as f64 + swing_step * i as f64).round() as i64,
                lift_mm: (current.lift_mm as f64 + lift_step * i as f64).round() as i64,
                elbow_deg: (current.elbow_deg as f64 + elbow_step * i as f64).round() as i64,
                wrist_deg: (current.wrist_deg as f64 + wrist_step * i as f64).round() as i64,
                gripper_mm: (current.gripper_mm as f64 + gripper_step * i as f64).round() as i64,
            };

            let op = Operation::new(
                user_id.clone(),
                Action::Update {
                    payload: state.clone(),
                },
            );

            // Schedule the message with a delay for animation effect
            ctx.run_later(delay * i as u32, move |actor, _ctx| {
                actor.state = state; // Update the actor's state
                actor.broadcast(op.clone());
            });
        }
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

    fn handle(&mut self, msg: Operation, ctx: &mut Self::Context) -> Self::Result {
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
            Action::Move { payload } => {
                match self.calculate_inverse_kinematics(&payload) {
                    Ok(target_state) => {
                        // Use interpolation to smoothly move to target state
                        self.interpolate_to_state(
                            target_state,
                            msg.user_id,
                            20,                        // Number of steps
                            Duration::from_millis(30), // Delay between steps
                            ctx,
                        );
                    }
                    Err(e) => {
                        tracing::error!("Failed to move to position: {}", e);
                    }
                }
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

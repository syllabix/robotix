use std::collections::{HashMap, HashSet};

use actix::{Actor, Context, Handler, Recipient};

use super::{
    message::{Action, Command, Connect, Disconnect, Operation, RobotCraneInfo, RobotCraneInfoRequest},
    models::{CraneDimensions, CraneState},
    user,
};

pub type ID = String;

#[derive(Debug, Clone)]
pub struct Crane {
    id: ID,
    state: CraneState,
    dimensions: CraneDimensions,
    recipients: HashMap<user::ID, Recipient<Operation>>,
}

impl Crane {
    pub fn new(id: ID) -> Self {
        Crane {
            id,
            recipients: Default::default(),
            state: Default::default(),
            dimensions: Default::default(),
        }
    }

    fn broadcast(&self, msg: Operation) {
        for (_, user) in self.recipients.iter() {
            user.do_send(msg.clone())
        }
    }

    fn register(&mut self, user_id: user::ID, addr: Recipient<Operation>) {
        self.recipients.insert(user_id, addr);
    }

    fn unregister(&mut self, user_id: user::ID) -> Option<Recipient<Operation>> {
        self.recipients.remove(&user_id)
    }

    fn process_commands(&mut self, commands: HashSet<Command>) -> CraneState {
        for cmd in commands {
            match cmd {
                Command::LiftUp => {
                    self.state.lift_mm += 1;                
                },
                Command::LiftDown => {
                    self.state.lift_mm -= 1;                
                },
                _ => {
                    tracing::info!("command not yet implemented: {:?}", cmd);                    
                }
                // Command::ElbowLeft => todo!(),
                // Command::ElbowRight => todo!(),
                // Command::WristLeft => todo!(),
                // Command::WristRight => todo!(),
                // Command::GripperOpen => todo!(),
                // Command::GripperClose => todo!(),
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
            },
            _ => tracing::warn!("robot action not implemented yet: {:?}", msg.action)
        }

        // match msg.action {
        //     Action::Join { payload } => todo!(),
        //     Action::Leave { payload } => todo!(),
        //     Action::Command { payload } => todo!(),
        //     Action::Update { payload } => todo!(),
        // }
    }
}

impl Handler<RobotCraneInfoRequest> for Crane {
    type Result = RobotCraneInfo;

    fn handle(&mut self, msg: RobotCraneInfoRequest, _ctx: &mut Self::Context) -> Self::Result {
        return RobotCraneInfo {
            id: self.id.clone(),
            state: self.state.clone(),
            dimensions: self.dimensions.clone(),
        };
    }
}

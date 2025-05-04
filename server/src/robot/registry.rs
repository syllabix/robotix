use actix::{Actor, Addr};
use dashmap::DashMap;

use super::{
    crane::{self, Crane},
    message::RobotCraneInfoRequest,
    models::CraneDetails,
};

#[derive(Debug)]
pub struct Registry {
    robots: DashMap<crane::ID, Addr<Crane>>,
}

impl Registry {
    pub fn new() -> Self {
        Registry {
            robots: Default::default(),
        }
    }

    pub async fn get_or_create(&self, id: crane::ID) -> Addr<Crane> {
        if let Some(addr) = self.robots.get(&id) {
            return addr.clone();
        }

        let robot = Crane::new(id.clone()).start();
        self.robots.insert(id, robot.clone());
        robot
    }

    pub async fn get_crane_details(&self, id: &crane::ID) -> Option<CraneDetails> {
        if let Some(addr) = self.robots.get(id) {
            return match addr.send(RobotCraneInfoRequest).await {
                Ok(info) => Some(CraneDetails {
                    id: info.id,
                    state: info.state,
                    dimensions: info.dimensions,
                }),
                Err(_) => None,
            };
        }
        None
    }
}

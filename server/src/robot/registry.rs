use actix::{Actor, Addr};
use dashmap::DashMap;

use super::crane::{self, Crane};

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

    pub async fn get_or_create(&mut self, id: crane::ID) -> Addr<Crane> {
        if let Some(addr) = self.robots.get(&id) {
            return addr.clone();
        }

        let robot = Crane::new(id.clone()).start();
        self.robots.insert(id, robot.clone());
        robot
    }
}

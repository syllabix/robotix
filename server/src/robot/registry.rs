use actix::{Actor, Addr};
use dashmap::DashMap;

use crate::storage::Database;

use super::{
    crane::{self, Crane},
    message::RobotCraneInfoRequest,
    models::{CraneDetails, CraneDimensions, CraneLimits},
};

#[derive(Debug)]
pub struct Registry {
    db: Database,
    robots: DashMap<crane::ID, Addr<Crane>>,
}

impl Registry {
    pub fn new(db: Database) -> Self {
        Registry {
            db,
            robots: Default::default(),
        }
    }

    #[tracing::instrument(name = "get_or_create", skip(self))]
    pub async fn get_or_create(&self, id: &crane::ID) -> Addr<Crane> {
        tracing::info!("fetching a robot from the registry");
        if let Some(addr) = self.robots.get(id) {
            return addr.clone();
        }

        let robot = match self.db.get(&id) {
            Some(crane) => crane.clone(),
            None => Crane::new(id.clone(), CraneDimensions::default(), CraneLimits::default())
        };

        let id = robot.id.clone();
        let robot = robot.start();
        self.robots.insert(id, robot.clone());
        robot
    }

    #[tracing::instrument(name = "get_crane_details", skip(self))]
    pub async fn get_crane_details(&self, id: &crane::ID) -> Option<CraneDetails> {
        tracing::info!("fetching crane details");
        let addr = self.get_or_create(id).await;
        return match addr.send(RobotCraneInfoRequest).await {
            Ok(info) => Some(CraneDetails {
                id: info.id,
                state: info.state,
                dimensions: info.dimensions,
            }),
            Err(_) => None,
        };
    }

    #[tracing::instrument(name = "get_all_crane_details", skip(self))]
    pub async fn get_all_crane_details(&self) -> Vec<CraneDetails> {
        let mut details = Vec::new();
        
        for crane in self.db.get_all() {
            let addr = self.get_or_create(&crane.id).await;
            if let Ok(info) = addr.send(RobotCraneInfoRequest).await {
                details.push(CraneDetails {
                    id: info.id,
                    state: info.state,
                    dimensions: info.dimensions,
                });
            }
        }
        
        details
    }
}

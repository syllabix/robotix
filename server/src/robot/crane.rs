use std::collections::HashMap;

use actix::{Actor, Context, Handler, Recipient};

use super::message::{Action, Connect, Disconnect};

pub type ID = String;

#[derive(Debug, Clone)]
pub struct Crane {
    id: ID,
    recipients: HashMap<usize, Recipient<Action>>,
}

impl Crane {
    pub fn new(id: ID) -> Self {
        Crane {
            id,
            recipients: Default::default(),
        }
    }

    fn broadcast(&self, msg: Action) {
        for (_, user) in self.recipients.iter() {
            user.do_send(msg.clone())
        }
    }
}

impl Actor for Crane {
    type Context = Context<Self>;
}

impl Handler<Connect> for Crane {
    type Result = ();

    fn handle(&mut self, msg: Connect, ctx: &mut Self::Context) -> Self::Result {
        todo!()
    }
}

impl Handler<Disconnect> for Crane {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, ctx: &mut Self::Context) -> Self::Result {
        todo!()
    }
}
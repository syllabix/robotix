use std::time::{Duration, Instant};

use actix::{Actor, ActorContext, Addr, AsyncContext, Handler};
use actix_web_actors::ws::{self, Message, ProtocolError};

use super::{
    crane::Crane,
    message::{Action, Connect, Disconnect},
};

// Every minute - check if this client is alive.
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(10);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(30);

pub type ID = usize;

pub struct User {
    pub id: ID,
    pub name: String,
    pub color: String,
    pub addr: Addr<Crane>,
    heartbeat: Instant,
}

impl User {
    pub fn new(id: ID, name: String, color: String, addr: Addr<Crane>) -> Self {
        User {
            id,
            name,
            color,
            addr,
            heartbeat: Instant::now(),
        }
    }

    fn heartbeat(&self, ctx: &mut <Self as Actor>::Context) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.heartbeat) > CLIENT_TIMEOUT {
                ctx.stop();
                return;
            }
            ctx.ping(b"");
        });
    }
}

impl Actor for User {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let addr = ctx.address();
        let msg = Connect {
            user: self.id,
            addr: addr.recipient(),
        };
        let _ = self.addr.send(msg);
        self.heartbeat(ctx);
    }

    fn stopped(&mut self, _ctx: &mut Self::Context) {
        let msg = Disconnect { user: self.id };
        let _ = self.addr.send(msg);
    }
}

impl Handler<Action> for User {
    type Result = ();

    fn handle(&mut self, msg: Action, ctx: &mut Self::Context) -> Self::Result {
        let json = serde_json::to_string(&msg).unwrap();
        ctx.text(json)
    }
}

use std::time::{Duration, Instant};

use actix::{Actor, ActorContext, Addr, AsyncContext, Handler, StreamHandler};
use actix_web_actors::ws::{self, Message, ProtocolError};
use chrono::Utc;

use super::{
    crane::Crane,
    message::{Action, Connect, Disconnect, Operation},
};

// Every minute - check if this client is alive.
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(10);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(30);

pub type ID = uuid::Uuid;

#[derive(Debug)]
pub struct User {
    pub id: ID,
    pub addr: Addr<Crane>,
    heartbeat: Instant,
}

impl User {
    pub fn new(id: ID, addr: Addr<Crane>) -> Self {
        User {
            id,
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
        tracing::info!("starting up user actor {}", self.id);
        let addr = ctx.address();
        let msg = Connect {
            user: self.id,
            addr: addr.recipient(),
        };
        self.addr.do_send(msg);
        self.heartbeat(ctx);
    }

    fn stopped(&mut self, _ctx: &mut Self::Context) {
        tracing::info!("stopping user actor {}", self.id);
        let msg = Disconnect { user: self.id };
        self.addr.do_send(msg);
    }
}

impl StreamHandler<Result<ws::Message, ProtocolError>> for User {
    fn handle(&mut self, msg: Result<Message, ProtocolError>, ctx: &mut Self::Context) {
        tracing::info!("handling in bound action {}", self.id);
        match msg {
            Ok(Message::Text(text)) => {
                let action: Action = match serde_json::from_slice(text.as_bytes()) {
                    Ok(c) => c,
                    Err(e) => {
                        tracing::error!("command not supported: {:?}", e);
                        return;
                    }
                };

                if let Err(e) = self.addr.try_send(Operation {
                    user_id: self.id,
                    action,
                    created_at: Utc::now(),
                }) {
                    tracing::error!("failed to send action to crane: {:?}", e);
                }
            }

            // The recurring Ping/Pong is used to keep connections alive; for every pong received
            // reset the heartbeat
            Ok(Message::Pong(_)) => {
                self.heartbeat = Instant::now();
            }

            // if the message is not next or a pong, we stop the context
            // for the user and effectively disconnect
            _ => ctx.stop(),
        }
    }
}

impl Handler<Operation> for User {
    type Result = ();

    fn handle(&mut self, msg: Operation, ctx: &mut Self::Context) -> Self::Result {
        let json = serde_json::to_string(&msg).unwrap();
        ctx.text(json)
    }
}

use crate::robot::{
    self, crane,
    User,
};
use actix_web::{web, HttpRequest, HttpResponse};
use actix_web_actors::ws;
use uuid::Uuid;

use super::errors::ServerError;

fn crane_id_from(req: &HttpRequest) -> Result<crane::ID, ServerError> {
    match req.match_info().get("id") {
        Some(id) => Ok(id.to_string()),
        None => Err(ServerError::RobotIdInvalid),
    }
}

#[tracing::instrument(name = "get", skip(req, robot_registry))]
pub async fn get(
    req: HttpRequest,
    robot_registry: web::Data<robot::Registry>,
) -> Result<HttpResponse, ServerError> {
    let id = crane_id_from(&req)?;
    match robot_registry.get_crane_details(&id).await {
        Some(details) => Ok(HttpResponse::Ok().json(details)),
        None => Err(ServerError::RobotNotFound(id)),
    }
}

#[tracing::instrument(name = "get_all", skip(_req, robot_registry))]
pub async fn get_all(
    _req: HttpRequest,
    robot_registry: web::Data<robot::Registry>,
) -> Result<HttpResponse, ServerError> {
    let robots = robot_registry.get_all_crane_details().await;
    if !robots.is_empty() {
        Ok(HttpResponse::Ok().json(robots))
    } else {
        Err(ServerError::NoRobotsAvailable)
    }
}

#[tracing::instrument(name = "connect", skip(req, stream, robot_registry))]
pub async fn connect(
    req: HttpRequest,
    stream: web::Payload,
    robot_registry: web::Data<robot::Registry>,
) -> Result<HttpResponse, ServerError> {
    let user_id = Uuid::new_v4();
    let crane_id = crane_id_from(&req)?;
    let robot_crane = robot_registry.get_or_create(&crane_id).await;
    ws::start(User::new(user_id, robot_crane), &req, stream)
        .map_err(|e| ServerError::SystemFailure(e.to_string()))
}

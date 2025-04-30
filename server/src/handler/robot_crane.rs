use crate::robot::{crane, models::CraneDimensions};
use actix_web::{HttpRequest, HttpResponse, Responder, ResponseError};

use super::errors::ServerError;

fn crane_id_from(req: &HttpRequest) -> Result<crane::ID, ServerError> {
    match req.match_info().get("id") {
        Some(id) => Ok(id.to_string()),
        None => Err(ServerError::RobotIdInvalid),
    }
}

#[tracing::instrument(name = "get_dimensions")]
pub async fn get_dimensions(req: HttpRequest) -> Result<HttpResponse, ServerError> {
    let _ = crane_id_from(&req)?;
    let dimensions = CraneDimensions::default();
    Ok(HttpResponse::Ok().json(dimensions))
}

// pub async fn get_crane_limits() -> impl Responder {
//     let limits = CraneLimits::default();
//     HttpResponse::Ok().json(limits)
// }

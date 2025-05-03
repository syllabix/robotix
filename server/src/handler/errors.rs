use actix_web::{
    body::BoxBody,
    http::{header::ContentType, StatusCode},
    HttpResponse, ResponseError,
};
use serde::Serialize;

#[derive(Serialize)]
struct Response {
    message: String,
}

#[derive(Debug, thiserror::Error)]
pub enum ServerError {
    #[error("the provided id is not a valid robot id")]
    RobotIdInvalid,

    #[error("the robot with id `{0}` was not found")]
    RobotNotFound(String),

    #[error("the server encountered an unexpected error: `{0}`")]
    SystemFailure(String),
}

impl ResponseError for ServerError {
    fn status_code(&self) -> StatusCode {
        match self {
            ServerError::RobotNotFound(_) => StatusCode::NOT_FOUND,
            ServerError::RobotIdInvalid => StatusCode::BAD_REQUEST,
            ServerError::SystemFailure(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse<BoxBody> {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::json())
            .json(Response {
                message: self.to_string(),
            })
    }
}

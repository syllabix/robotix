use actix_web::{
    body::BoxBody,
    http::{header::ContentType, StatusCode},
    HttpResponse, ResponseError,
};

#[derive(Debug, thiserror::Error)]
pub enum ServerError {
    #[error("the provided id is not a valid robot id")]
    RobotIdInvalid,

    #[error("the robot with id `{0}` was not found")]
    RobotNotFound(String),
}

impl ResponseError for ServerError {
    fn status_code(&self) -> StatusCode {
        match self {
            ServerError::RobotNotFound(_) => StatusCode::NOT_FOUND,
            ServerError::RobotIdInvalid => StatusCode::BAD_REQUEST,
        }
    }

    fn error_response(&self) -> HttpResponse<BoxBody> {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::json())
            .json(self.to_string())
    }
}

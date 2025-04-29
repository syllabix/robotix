use actix_cors::Cors;

pub fn cors_config(allow_origin: &str) -> Cors {
    Cors::default()
        .allowed_origin(allow_origin)
        .allowed_methods(vec!["GET", "PUT"])
        .allow_any_header()
        .supports_credentials()
        .max_age(3600)
}

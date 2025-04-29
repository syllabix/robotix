use tracing_subscriber::{fmt::Layer, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

pub fn setup(log_level: &str) {
    tracing_subscriber::registry()
        .with(EnvFilter::builder().parse_lossy(log_level))
        .with(Layer::default().compact())
        .init();
}

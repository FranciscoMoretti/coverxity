export function shouldUseRateLimit() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  );
}

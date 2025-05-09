import redis
import os

# In production, use environment variables or a config file for credentials
REDIS_HOST = os.getenv("REDIS_HOST", "redis-10499.c253.us-central1-1.gce.redns.redis-cloud.com")
REDIS_PORT = int(os.getenv("REDIS_PORT", 10499))
REDIS_USERNAME = os.getenv("REDIS_USERNAME", "default")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "tLVfW4wFRmwQKR4N1BYUCqRikCfB3E3x")

r = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
    username=REDIS_USERNAME,
    password=REDIS_PASSWORD,
)

def set_key_value(key: str, value: str) -> bool:
    return r.set(key, value)

def get_value(key: str) -> str:
    return r.get(key)

if __name__ == "__main__":
    # Example usage
    success = set_key_value('foo', 'bar')
    result = get_value('foo')
    print(result)
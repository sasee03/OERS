from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL:str
    SECRET_KEY:str
    ALGORITHM:str = "HS256"
    TOKEN_EXPIRE_MINUTES: int = 60  # 60 minutes default
    model_config=SettingsConfigDict(env_file=".env")

settings = Settings()
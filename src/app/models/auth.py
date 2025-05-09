from pydantic import BaseModel

class LoginModel(BaseModel):
    email: str
    password: str
    
class TokenModel(BaseModel):
    token: str
    refreshToken: str
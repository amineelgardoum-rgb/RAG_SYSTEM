from pydantic import BaseModel
from typing import Optional, Any, Dict

class LogRequest(BaseModel):
    level: str  # info, error, warn, debug
    message: str
    name: Optional[str] = "frontend"
    metadata: Optional[Dict[str, Any]] = None

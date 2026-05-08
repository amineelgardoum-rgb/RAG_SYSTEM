
from pydantic import BaseModel
class QueryRequest(BaseModel):
    """
    This class is used to represent the query request.
    
    Attributes:
        query: Query to ask
    """
    query: str

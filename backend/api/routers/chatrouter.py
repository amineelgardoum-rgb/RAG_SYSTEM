from fastapi import APIRouter,HTTPException
from api.llm.ask import ask
from api.models.queryRequest import QueryRequest
from api.config.logger import get_logger
router=APIRouter()
logger=get_logger(__name__)
@router.post("/api/chat")
async def chat(request: QueryRequest):
    """
    This function is used to ask a question to the NL2SQL system.
    
    Args:
        request: QueryRequest object containing the query
        
    Returns:
        dict: Dictionary containing the answer
    """
    if not request.query:
        logger.error("Query is empty")
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    answer = ask(request.query)
    if not isinstance(answer,str):
        answer = str(answer)
    logger.info(f"✅ Answer: {answer}")
    return {"answer": answer}
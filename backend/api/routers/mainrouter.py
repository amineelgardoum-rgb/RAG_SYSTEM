from fastapi import APIRouter
router=APIRouter()
@router.get("/")
async def root():
    """
    This function is used to check if the API is running.
    
    Returns:
        dict: Dictionary containing the message
    """
    return {"message": "NL2SQL System API is running."}



import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import rag
from contextlib import asynccontextmanager


# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    rag.get_agent()  # warm up the agent on start
    yield
    # shutdown (add cleanup here if needed)

app = FastAPI(title="NL2SQL System API",lifespan=lifespan)

@app.post("/api/chat")
async def chat(request: QueryRequest):
    if not request.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    answer = rag.query_system(request.query)
    return {"answer": answer}

@app.get("/")
async def root():
    return {"message": "NL2SQL System API is running."}

if __name__=="__main__":
    import uvicorn
    uvicorn.run(app,host="127.0.0.1",port=8000,reload=True)
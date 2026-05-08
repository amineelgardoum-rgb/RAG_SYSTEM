import uvicorn
from fastapi import FastAPI
from api.routers import chatrouter, mainrouter, healthrouter, refreshrouter, logrouter
from api.config.corsConfig import configure_cors
from api.config.context_manager import lifespan
from dotenv import load_dotenv
from api.config.logger import get_logger
load_dotenv()
logger = get_logger(__name__)




app = FastAPI(title="NL2SQL System API", lifespan=lifespan)
configure_cors(app)
app.include_router(chatrouter.router)
app.include_router(mainrouter.router)
app.include_router(healthrouter.router)
app.include_router(refreshrouter.router)
app.include_router(logrouter.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)

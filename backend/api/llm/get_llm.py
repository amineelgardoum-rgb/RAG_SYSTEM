import os
from functools import lru_cache
# pyrefly: ignore [missing-import]
from langchain_google_genai import ChatGoogleGenerativeAI
@lru_cache(maxsize=1)
def get_llm():
    """
    This function is used to get the LLM.
    
    Returns:
        LLM object
    """
    env = os.getenv("ENV", "development")

    if env == "production":
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is not set.")
        return ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0,
            google_api_key=api_key
        )
    else:
        # pyrefly: ignore [missing-import]
        from langchain_ollama import ChatOllama
        return ChatOllama(
            model=os.getenv("OLLAMA_MODEL", "qwen2.5:3b"),
            temperature=0,
            base_url="http://localhost:11434"
        )

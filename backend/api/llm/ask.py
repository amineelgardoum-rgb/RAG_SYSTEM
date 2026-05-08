from api.llm.get_agent import get_agent
# logger
from api.config.logger import get_logger
logger = get_logger(__name__)


def ask(question: str) -> str:
    """
    This function is used to ask a question to the LLM.
    
    Args:
        question: Question to ask
        
    Returns:
        str: Answer to the question
    """
    try:
        agent = get_agent()
        logger.info(f"📨 Question: {question}")
        logger.info("⏳ Querying database...\n")

        response = agent.invoke({
            "messages": [{"role": "user", "content": question}]
        })

        messages = response["messages"]
        for message in reversed(messages):
            if hasattr(message, "content") and message.content:
                if message.__class__.__name__ == "AIMessage":
                    content = message.content

                    # ✅ Handle list of blocks {type, text, extras} — Gemini format
                    if isinstance(content, list):
                        return " ".join(
                            block.get("text", "")
                            for block in content
                            if isinstance(block, dict) and block.get("type") == "text"
                        )

                    # ✅ Handle plain string — Ollama format
                    if isinstance(content, str):
                        return content

                    # ✅ Fallback
                    return str(content)

        return "No response generated."

    except ValueError as e:
        logger.error(f"❌ ValueError: {e}")
        return f"Configuration error: {e}"
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"❌ Error: {e}")
        return f"Error: {e}"
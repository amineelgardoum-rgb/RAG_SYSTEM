import os
from functools import lru_cache
from langchain_community.utilities.sql_database import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langgraph.prebuilt import create_react_agent
from api.config.prompt import SYSTEM_PROMPT
from api.llm.get_llm import get_llm
# logger
from api.config.logger import get_logger
logger = get_logger(__name__)


@lru_cache(maxsize=1)
def get_agent():
    """
    This function is used to get the agent.

    Returns:
        Agent: Agent object
    """
    sql_url = os.getenv("SQL_SERVER_URL")
    if not sql_url:
        raise ValueError("SQL_SERVER_URL is not set in your .env file.")

    llm = get_llm()

    db = SQLDatabase.from_uri(sql_url, schema="gold")

    logger.info("✅ Connected to DB: JobsDataWarehouse")
    logger.info(f"📋 Tables found: {db.get_usable_table_names()}.")

    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    tools = toolkit.get_tools()

    return create_react_agent(model=llm, tools=tools, prompt=SYSTEM_PROMPT)

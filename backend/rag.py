import os
from functools import lru_cache
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities.sql_database import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langgraph.prebuilt import create_react_agent

load_dotenv()

SYSTEM_PROMPT = """You are a data analyst assistant for a Jobs Data Warehouse.

Your job is to answer user questions with REAL DATA from the database.

Available tables (ALWAYS prefix with schema):
- bronze.indeed_jobs        → raw jobs from Indeed
- bronze.rekrute_jobs       → raw jobs from Rekrute
- silver.indeed_jobs_clean  → cleaned Indeed jobs
- silver.rekrute_jobs_clean → cleaned Rekrute jobs
- silver.jobs_staging       → combined staging jobs
- gold.fact_jobs            → main facts table (USE THIS FOR ANALYSIS)
- gold.dim_location         → location details
- gold.dim_job_type         → job type details
- gold.dim_date             → date details

STRICT RULES:
1. ALWAYS use the tools to execute SQL and retrieve real data
2. NEVER show SQL queries to the user — only show the results
3. ALWAYS prefix tables with schema name (e.g. gold.fact_jobs)
4. Use only SELECT statements
5. After getting query results, summarize them in plain English
6. Present data as clean tables or bullet points, not raw SQL output
7. If asked "top 10 jobs", run the query and return the actual 10 jobs
8. NEVER say "you can run this query" — YOU run the query and return results
"""


@lru_cache(maxsize=1)
def get_llm():
    env = os.getenv("ENV", "development")

    if env == "production":
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is not set.")
        return ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0,
            google_api_key=api_key
        )
    else:
        from langchain_ollama import ChatOllama
        return ChatOllama(
            model=os.getenv("OLLAMA_MODEL", "mistral"),
            temperature=0,
            base_url="http://localhost:11434"
        )


@lru_cache(maxsize=1)
def get_agent():
    sql_url = os.getenv("SQL_SERVER_URL")
    if not sql_url:
        raise ValueError("SQL_SERVER_URL is not set in your .env file.")

    llm = get_llm()

    db = SQLDatabase.from_uri(
        sql_url,
        schema="gold"
    )

    print(f"✅ Connected to DB: JobsDataWarehouse")
    print(f"📋 Tables found: {db.get_usable_table_names()}")

    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    tools = toolkit.get_tools()

    return create_react_agent(
        model=llm,
        tools=tools,
        prompt=SYSTEM_PROMPT
    )


def ask(question: str) -> str:
    """Ask a natural language question and get real data back."""
    try:
        agent = get_agent()
        print(f"\n📨 Question: {question}")
        print("⏳ Querying database...\n")

        response = agent.invoke({
            "messages": [{"role": "user", "content": question}]
        })

        # Extract final answer from last AI message
        messages = response["messages"]
        for message in reversed(messages):
            if hasattr(message, "content") and message.content:
                if message.__class__.__name__ == "AIMessage":
                    return message.content

        return "No response generated."

    except ValueError as e:
        return f"Configuration error: {e}"
    except Exception as e:
        return f"Error: {e}"


if __name__ == "__main__":
    print("=== Jobs Data Warehouse RAG System ===")
    print("Ask questions about jobs data. Type 'exit' to quit.\n")
    print("Example questions:")
    print("  - What are the top 10 most in-demand jobs?")
    print("  - How many jobs are available in Casablanca?")
    print("  - What are the trending job skills?\n")

    while True:
        user_input = input("You: ").strip()
        if not user_input:
            continue
        if user_input.lower() in ("exit", "quit"):
            print("Goodbye!")
            break
        answer = ask(user_input)
        print(f"\nAssistant: {answer}\n")
        print("-" * 50)
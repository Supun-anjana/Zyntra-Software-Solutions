from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL")
SITE_URL = os.getenv("OPENROUTER_SITE_URL")
SITE_NAME = os.getenv("OPENROUTER_SITE_NAME")


@tool
def read_note(filepath: str) -> str:
    """Read the contents of a text file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        return f"Contents of '{filepath}':\n{content}"
    except FileNotFoundError:
        return f"Error: File '{filepath}' not found."
    except Exception as e:
        return f"Error reading file: {str(e)}"


@tool
def write_note(filepath: str, content: str) -> str:
    """Write content to a text file. This will overwrite the file if it exists."""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return f"Successfully wrote {len(content)} characters to '{filepath}'."
    except Exception as e:
        return f"Error writing file: {str(e)}"


TOOLS = [read_note, write_note]

SYSTEM_MESSAGE = (
    "You are a professional customer support agent for Zyntra Software Solution. "
    "Your role is to assist customers with inquiries related to the company's services, "
    "including web application development, POS system development, and AI systems development. "
    "Always respond in a polite, formal, and professional manner. "
    "Provide clear and accurate information to help customers understand the company's offerings, "
    "processes, and policies. "
    "When discussing pricing or quotes, always direct customers to contact our sales team at "
    "zyntrasoftwaresolution@gmail.com for a personalized estimate. "
    "If a customer's question cannot be answered based on available information, "
    "courteously direct them to contact us at zyntrasoftwaresolution@gmail.com for further assistance."
)

llm = ChatOpenAI(
    model=OPENROUTER_MODEL,          # picks up "stepfun/step-3.5-flash:free" from .env
    temperature=0,
    openai_api_key=OPENROUTER_API_KEY,
    openai_api_base="https://openrouter.ai/api/v1",
    default_headers={
        "HTTP-Referer": SITE_URL,
        "X-OpenRouter-Title": SITE_NAME,
    },
)
agent = create_react_agent(llm, TOOLS, prompt=SYSTEM_MESSAGE)


def run_agent(user_input: str) -> str:
    """Run the agent with a user query and return the response."""
    try:
        result = agent.invoke(
            {"messages": [{"role": "user", "content": user_input}]},
            config={"recursion_limit": 50}
        )
        return result["messages"][-1].content
    except Exception as e:
        return f"Error: {str(e)}"

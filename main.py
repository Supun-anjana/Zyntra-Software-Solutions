from fastapi import FastAPI, HTTPException, Request
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from agent import run_agent
import uvicorn
from fastapi.staticfiles import StaticFiles

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Request model


class AgentRequest(BaseModel):
    """Request model for agent invocation."""
    prompt: str


# Response model
class AgentResponse(BaseModel):
    """Response model for agent invocation."""
    response: str


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/index.html")
async def index_html(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/about.html")
async def about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})


@app.get("/services.html")
async def services(request: Request):
    return templates.TemplateResponse("services.html", {"request": request})


@app.get("/contact.html")
async def contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})


@app.get("/profile.html")
async def profile(request: Request):
    return templates.TemplateResponse("profile.html", {"request": request})


@app.post("/agent", response_model=AgentResponse)
async def invoke_agent(request: AgentRequest):
    """
    Invoke the AI agent with a prompt.

    The agent can read and write text files based on natural language instructions.
    """
    try:
        if not request.prompt.strip():
            raise HTTPException(
                status_code=400, detail="Prompt cannot be empty")

        # Run the agent with the user's prompt
        result = run_agent(request.prompt)

        return AgentResponse(response=result)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error invoking agent: {str(e)}")

uvicorn.run(app, port=8000)

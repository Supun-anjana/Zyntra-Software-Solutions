# Zyntra Official Website

A FastAPI-based company website for Zyntra Software Solution, with Jinja2-rendered pages and an AI-powered support endpoint.

## Features

- Multi-page website (`index`, `about`, `services`, `contact`, `profile`)
- Static assets support (CSS, JS, images, data)
- AI assistant endpoint at `POST /agent`
- Environment-based model/API configuration via `.env`

## Tech Stack

- Python 3.12+
- FastAPI
- Uvicorn
- Jinja2 templates
- LangChain + LangGraph + OpenRouter (via `langchain-openai`)

## Project Structure

```text
.
├─ main.py
├─ agent.py
├─ requirements.txt
├─ templates/
│  ├─ index.html
│  ├─ about.html
│  ├─ services.html
│  ├─ contact.html
│  └─ profile.html
└─ static/
	 ├─ css/
	 ├─ js/
	 ├─ images/
	 └─ data/
```

## Setup

1. Clone the repository.
2. Create and activate a virtual environment.
3. Install dependencies.

### Windows (PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=stepfun/step-3.5-flash:free
OPENROUTER_SITE_URL=http://localhost:8000
OPENROUTER_SITE_NAME=Zyntra Official Website
```

## Run the App

Use:

```bash
python main.py
```

Then open:

- `http://127.0.0.1:8000/`

## Available Routes

### Pages

- `GET /`
- `GET /index.html`
- `GET /about.html`
- `GET /services.html`
- `GET /contact.html`
- `GET /profile.html`

### API

- `POST /agent`

Request body:

```json
{
	"prompt": "Tell me about your web development services"
}
```

Response body:

```json
{
	"response": "..."
}
```

## Notes

- If `.env` values are missing, AI responses may fail.
- Make sure port `8000` is free before starting the app.

# Zyntra-Software-Solutions

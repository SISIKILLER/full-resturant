# Restaurant API

FastAPI backend serving meals and feedbacks with caching.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
python3 app.py
```

Server runs on http://localhost:8000

## Data Files

Place JSON files in `data/` directory:
- `meals.json`
- `feedbacks.json`

## Endpoints

- `GET /` - Health check
- `GET /apis/meals` - Get all meals
- `GET /apis/feedbacks` - Get all feedbacks


## Dev

Back-end was developed by [@ShayanGolmezerji](https://github.com/ShayanGolmezerji)
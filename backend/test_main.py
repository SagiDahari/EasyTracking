import pytest
from fastapi.testclient import TestClient
import httpx

from main import app


@pytest.mark.asyncio
async def test_root_endpoint():
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Welcome To EasyTracking API!"}


@pytest.mark.asyncio
@pytest.mark.parametrize("endpoint", ["/food/meat", "/food/avocado", "/food/sushi"])
async def test_getFoods(endpoint):
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.get(endpoint)
        assert response.status_code == 200


@pytest.mark.asyncio
@pytest.mark.parametrize("endpoint", ["/food/ ", "/food/notfood"])
async def test_getFoods(endpoint):
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.get(endpoint)
        assert response.status_code == 400
        assert response.json() == {"detail": "Food not in the database."}


@pytest.mark.asyncio
async def test_postFoodsErr():
    payload = {
        "name": "apple",
        "calories_100g": 52.0,
        "proteins": 0.3,
        "carbohydrates": 14.0,
        "fats": 0.2,
    }
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.post("/food/sushi", json=payload)
        assert response.status_code == 400

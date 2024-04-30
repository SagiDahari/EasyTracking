from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from pydantic import BaseModel
import httpx
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session



app = FastAPI()
models.Base.metadata.create_all(bind=engine)


class FoodsBase(BaseModel):
    name: str
    calories_100g: float
    proteins: float
    carbohydrates: float
    fats: float


class MealsBase(BaseModel):
    type: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependancy = Annotated[Session, Depends(get_db)]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://api.api-ninjas.com/v1/nutrition"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"Welcome To EasyTracking API!"}


# fetches the food from the external api.
@app.get("/food/{food_query}", status_code=status.HTTP_200_OK)
async def getFoods(food_query: str):
    api_url = f"https://api.api-ninjas.com/v1/nutrition?query={food_query}"
    headers = {"X-Api-Key": "qYMvSdJILxMK9wsehxV1jg==e9gL3P6fvIJ3xj3M"}

    async with httpx.AsyncClient() as client:
        response = await client.get(api_url, headers=headers)
        if response.status_code == httpx.codes.OK:
            data = response.json()
            # handling empty responses from the external API
            if len(data) == 0:
                raise HTTPException(status_code=400, detail="Food not in the database.")
            else:
                # Extract desired fields from each item
                foods = []
                for item in data:
                    filtered_item = {
                        "name": item["name"],
                        "calories_100g": item["calories"],
                        "proteins": item["protein_g"],
                        "carbohydrates": item["carbohydrates_total_g"],
                        "fats": item["fat_total_g"],
                    }
                    food = FoodsBase.parse_obj(filtered_item)
                    foods.append(food)
                return foods
        else:
            raise HTTPException(status_code=400, detail="Food not found")


# posting the food from the external api to the database.
@app.post("/food/{food_name}", status_code=status.HTTP_200_OK)
async def postFood(food: FoodsBase, food_name: str, db: db_dependancy):
    if food.name == food_name:
        db_food = models.FoodItem(**food.model_dump())
        db.add(db_food)
        db.commit()
        return db_food
    else:
        raise HTTPException(status_code=400, detail="food not found")


# deleting food from database.
@app.delete("/food/{food_name}", status_code=status.HTTP_200_OK)
def deleteFood(food_name: str, db: db_dependancy):
    db_food = (
        db.query(models.FoodItem).filter(models.FoodItem.name == food_name).first()
    )
    if db_food is None:
        raise HTTPException(status_code=400, detail="No such food exists.")
    db.delete(db_food)
    db.commit()


# creating a new meal.
@app.post("/meals", status_code=status.HTTP_201_CREATED)
async def createNewMeal(meal: MealsBase, db: db_dependancy):
    if meal.type not in {"breakfast", "lunch", "dinner"}:
        raise HTTPException(status_code=400, detail=f"{meal.type} is not a meal")

    db_meal = models.Meals(**meal.model_dump())
    db.add(db_meal)
    db.commit()
    return db_meal


# adds a food to a meal from the database, using the food's name.
@app.post("/meals/food/{food_name}", status_code=status.HTTP_200_OK)
async def addFoodtoMeal(
    mealBase: MealsBase,
    foodItem: FoodsBase,
    food_name: str,
    quantity: int,
    db: db_dependancy,
):
    if mealBase.type not in {"breakfast", "lunch", "dinner"}:
        raise HTTPException(status_code=400, detail="Invalid meal type")

    food = db.query(models.FoodItem).filter(models.FoodItem.name == food_name).first()
    if not food:
        food = await postFood(foodItem, foodItem.name, db)

    meal = db.query(models.Meals).filter(models.Meals.type == mealBase.type).first()
    if not meal:
        meal = await createNewMeal(mealBase, db)
    # checking if the food does not already exists in that specified meal.
    if (
        not db.query(models.MealFoodItem)
        .filter(
            models.MealFoodItem.meal_id == meal.id,
            models.MealFoodItem.food_id == food.id,
        )
        .first()
    ):
        meal_food_item = models.MealFoodItem(
            meal_id=meal.id,
            meal_name=meal.type,
            food_id=food.id,
            food_name=food.name,
            quantity=quantity,
            calories_100g=food.calories_100g,
            proteins=food.proteins,
            carbohydrates=food.carbohydrates,
            fats=food.fats,
        )

        db.add(meal_food_item)
        db.commit()
    else:
        raise HTTPException(status_code=409, detail="food already exists in that meal")


# fetching the meal with added foods from the database.
@app.get("/meals/{meal_name}", status_code=status.HTTP_200_OK)
async def getMeal(meal_name: str, db: db_dependancy):
    meal = (
        db.query(models.MealFoodItem)
        .filter(models.MealFoodItem.meal_name == meal_name)
        .all()
    )
    if len(meal) == 0:
        raise HTTPException(status_code=204, detail=f"{meal_name}, is empty")
    else:
        return meal


# deleting a meal.
@app.delete("/meals/", status_code=status.HTTP_200_OK)
def deleteMeal(meal_id: int, db: db_dependancy):
    db_meal = db.query(models.Meals).filter(models.Meals.id == meal_id).first()
    if db_meal is None:
        raise HTTPException(status_code=400, detail="No such meal exists.")
    db.delete(db_meal)
    db.commit()


# deleting a food from the meal's database using it's name.
@app.delete("/meals/food/{food_name}", status_code=status.HTTP_200_OK)
def deleteFoodFromMeal(meal_name: str, food_name: str, db: db_dependancy):
    db_food = (
        db.query(models.MealFoodItem)
        .filter(models.MealFoodItem.meal_name == meal_name)
        .filter(models.MealFoodItem.food_name == food_name)
    ).first()
    if db_food is None:
        raise HTTPException(status_code=400, detail="No such food exists.")
    db.delete(db_food)
    db.commit()


# updating the quantity of a food.
@app.put("/meals/food/{food_name}", status_code=status.HTTP_200_OK)
async def updateQuantity(
    meal_name: str, food_name: str, newQuantity: int, db: db_dependancy
):
    try:
        db_food_meal = (
            db.query(models.MealFoodItem)
            .filter(models.MealFoodItem.food_name == food_name)
            .filter(models.MealFoodItem.meal_name == meal_name)
            .first()
        )
        if not db_food_meal:
            raise HTTPException(status_code=400, detail="food is not in the database")
        else:
            db_food = (
                db.query(models.FoodItem)
                .filter(models.FoodItem.name == db_food_meal.food_name)
                .first()
            )
            db_food_meal.quantity = newQuantity
            db_food_meal.calories_100g = round(
                db_food.calories_100g * (newQuantity / 100), 2
            )
            db_food_meal.proteins = round(db_food.proteins * (newQuantity / 100), 2)
            db_food_meal.carbohydrates = round(
                db_food.carbohydrates * (newQuantity / 100), 2
            )
            db_food_meal.fats = round(db_food.fats * (newQuantity / 100), 2)
            db.commit()

    except Exception as e:
        print(f"Error updating quantity: {e}")

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update quantity. Please try again later.",
        )

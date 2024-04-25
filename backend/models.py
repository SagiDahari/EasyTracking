from sqlalchemy import Table, ForeignKey, String, Integer, Column, Float
from sqlalchemy.orm import relationship
from database import Base


class FoodItem(Base):
    __tablename__ = "foods_table"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(20), unique=True)
    calories_100g = Column(Float)
    proteins = Column(Float)
    carbohydrates = Column(Float)
    fats = Column(Float)


class Meals(Base):
    __tablename__ = "meals_table"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(10))
    foods = relationship("FoodItem", secondary="meal_food_table")


class MealFoodItem(Base):
    __tablename__ = "meal_food_table"

    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals_table.id"))
    meal_name = Column(String(10))
    food_id = Column(Integer, ForeignKey("foods_table.id"))
    food_name = Column(String(20))
    quantity = Column(Integer)
    calories_100g = Column(Float)
    proteins = Column(Float)
    carbohydrates = Column(Float)
    fats = Column(Float)

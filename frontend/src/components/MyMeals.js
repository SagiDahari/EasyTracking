import React, { useState } from "react";
import MealColumn from "./MealColumn";
import { useNavigate } from "react-router-dom";

function MyMeals() {
  const [breakfastFoods, setBreakfastFoods] = useState([]);
  const [lunchFoods, setLunchFoods] = useState([]);
  const [dinnerFoods, setDinnerFoods] = useState([]);

  const navigate = useNavigate();

  const handleClick = () => {
    console.log("button clicked");
    navigate("/");
  };

  

  const fetchFoods = async (meal_name) => {
    try {
      const response = await fetch(`http://localhost:8000/meals/${meal_name}`);
      if (response.ok) {
        const contentLength = response.headers.get("Content-Length");
        if (contentLength && parseInt(contentLength) > 0) {
          const data = await response.json();
          if (meal_name === "breakfast") setBreakfastFoods(data);
          else if (meal_name === "lunch") setLunchFoods(data);
          else if (meal_name === "dinner") setDinnerFoods(data);
        } else {
          console.log("Error: Response body is empty");
        }
      } else {
        console.log(
          `Error: ${response.status}, food does not exist in the database`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    //console.log(breakfastFoods);
    //console.log(lunchFoods);
    //console.log(dinnerFoods);
  };

  // Function to remove a food item from the column
  const removeFood = async (food_name, meal_name) => {
    try {
      const response = await fetch(
        `http://localhost:8000/meals/food/${food_name}?meal_name=${meal_name}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        switch (meal_name) {
          case "breakfast":
            setBreakfastFoods(
              breakfastFoods.filter((food) => food["food_name"] !== food_name)
            );
            break;
          case "lunch":
            setLunchFoods(
              lunchFoods.filter((food) => food["food_name"] !== food_name)
            );
            break;
          case "dinner":
            setDinnerFoods(
              dinnerFoods.filter((food) => food["food_name"] !== food_name)
            );
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error("Error removing food:", error);
    }
  };

  // Function to update quantity of a food item
  const updateQuantity = async (meal_name, food_name, newQuantity) => {
    try {
      const response = await fetch(
        `http://localhost:8000/meals/food/${food_name}?meal_name=${meal_name}&newQuantity=${newQuantity}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) console.log("Quantity Changed!");
      else
        console.log("there was a problem while trying to change the quantity");
    } catch (error) {
      console.error("Error changing the quantity:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center">My Meals</h1>
      <div className="col-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Back To Search
          </button>
        </div>
      <div className="row mt-5 text-center">
        <div className="col">
          <MealColumn
            title="Breakfast"
            fetchFoods={() => fetchFoods("breakfast")}
            foods={breakfastFoods}
            onRemoveFoods={(food_name) => removeFood(food_name, "breakfast")}
            onUpdateQuantity={(food_name, newQuantity) =>
              updateQuantity("breakfast", food_name, newQuantity)
            }
          />
        </div>
        <div className="col">
          <MealColumn
            title="Lunch"
            fetchFoods={() => fetchFoods("lunch")}
            foods={lunchFoods}
            onRemoveFoods={(food_name) => removeFood(food_name, "lunch")}
            onUpdateQuantity={(food_name, newQuantity) =>
              updateQuantity("lunch", food_name, newQuantity)
            }
          />
        </div>
        <div className="col">
          <MealColumn
            title="Dinner"
            fetchFoods={() => fetchFoods("dinner")}
            foods={dinnerFoods}
            onRemoveFoods={(food_name) => removeFood(food_name, "dinner")}
            onUpdateQuantity={(food_name, newQuantity) =>
              updateQuantity("dinner", food_name, newQuantity)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default MyMeals;

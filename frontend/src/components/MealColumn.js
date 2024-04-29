import React, { useEffect, useState } from "react";

function MealColumn({
  title,
  fetchFoods,
  foods,
  onRemoveFoods,
  onUpdateQuantity,
}) {
  const [updatedQuantities, setUpdatedQuantities] = useState({});

  const handleQuantityChange = (foodName, newQuantity) => {
    setUpdatedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [foodName]: newQuantity,
    }));
  };
  // handling the UpdateQuantity button.
  const handleUpdateQuantity = async (foodName) => {
    const newQuantity = updatedQuantities[foodName];
    await onUpdateQuantity(foodName, newQuantity);
    fetchFoods(); // Fetch new data after updating quantity
  };

  // Function to calculate total calories for the meal
  const calculateTotal = () => {
    let totalCalories = 0;
    let totalProteins = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    foods.forEach((food) => {
      totalCalories += food["calories_100g"];
      totalProteins += food["proteins"];
      totalCarbs += food["carbohydrates"];
      totalFats += food["fats"];
    });

    return {
      totalCalories: totalCalories.toFixed(2),
      totalProteins: totalProteins.toFixed(2),
      totalCarbs: totalCarbs.toFixed(2),
      totalFats: totalFats.toFixed(2),
    };
  };

  const { totalCalories, totalProteins, totalCarbs, totalFats } =
    calculateTotal();

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div className="meal-column">
      <h2>{title}</h2>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Calories</th>
            <th>Proteins</th>
            <th>Carbs</th>
            <th>Fats</th>
            <th>Quantity(Grams)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food, index) => (
            <tr key={index}>
              <td>{food["food_name"]}</td>
              <td>{food["calories_100g"]}</td>
              <td>{food["proteins"]}</td>
              <td>{food["carbohydrates"]}</td>
              <td>{food["fats"]}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={
                    updatedQuantities[food["food_name"]] !== undefined
                      ? updatedQuantities[food["food_name"]]
                      : food["quantity"]
                  }
                  onChange={(e) =>
                    handleQuantityChange(
                      food["food_name"],
                      parseInt(e.target.value)
                    )
                  }
                />
              </td>
              <td>
                <button onClick={() => handleUpdateQuantity(food["food_name"])}>
                  Update Quantity
                </button>
                <button onClick={() => onRemoveFoods(food["food_name"])}>
                  Remove Food
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <strong>Total Calories:</strong> {totalCalories} kcal
        <br />
        <strong>Total Proteins:</strong> {totalProteins} g
        <br />
        <strong>Total Carbohydrates:</strong> {totalCarbs} g
        <br />
        <strong>Total Fats:</strong> {totalFats} g
      </div>
    </div>
  );
}

export default MealColumn;

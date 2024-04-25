import FoodTable from "./Searchbar";
import { useNavigate } from "react-router-dom";
import React from "react";

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("button clicked");
    navigate("/mymeals");
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Go To MyMeals
          </button>
        </div>

        <div className="row mt-5">
          <div className="col-4" />
          <h1 className="col">Welcome to Easy Tracking!</h1>
        </div>
        <div className="row mt-5 text-center">
          <p>
            {" "}
            This app was created in order to make it easier for people to track
            their daily calorie intake. here you can browse from a database of
            many types of foods and add it to your personal meals You can also
            calculate your pesonal BMR which will help you get to your daily
            calorie goals.
          </p>
        </div>
        <div className="row mt-5">
          <FoodTable />
        </div>
      </div>
    </div>
  );
}

export default Home;

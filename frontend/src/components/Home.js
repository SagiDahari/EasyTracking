import FoodTable from "./Searchbar";
import BMR from "./BMR";
import { useNavigate } from "react-router-dom";
import React from "react";

function Home() {
  const navigate = useNavigate();

  const navigateToMyMeals = () => {
    navigate("/mymeals");
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-4">
          <button type="button" className="btn btn-dark" onClick={navigateToMyMeals}>
            Go To MyMeals
          </button>
        </div>

        <div className="row mt-5">
          <div className="col-4" />
          <h1 className="text-center">Welcome to Easy Tracking!</h1>
          <img
            src="diet.svg"
            alt="Meal Icon"
            className="icon"
            width="300px"
            height="150px"
          />
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
          <div className="col-3">
            <BMR />
          </div>
          <div className="col-9">
            <FoodTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

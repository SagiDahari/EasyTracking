import { useState } from "react";
import "./BMR.css";

function BMR() {
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [gender, setGender] = useState("");
  const [bmr, setCalculatedBMR] = useState(null);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const calculateBMR = () => {
    let BMR = 0;
    if (gender === "male") {
      BMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else if (gender === "female") {
      BMR = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }
    setCalculatedBMR(BMR.toFixed(2));
  };

  return (
    <div className="bmr-container">
      <h2 className="bmr-title">Calculate Your BMR</h2>
      <form className="bmr-form">
        <div className="bmr-input-group">
          <label htmlFor="age-field" className="bmr-label">
            Age:
          </label>
          <input
            type="number"
            min="15"
            max="80"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="bmr-input"
          />
        </div>
        <div className="bmr-input-group">
          <label htmlFor="weight-field" className="bmr-label">
            Weight (kg):
          </label>
          <input
            type="number"
            min="0"
            max="200"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="bmr-input"
          />
        </div>
        <div className="bmr-input-group">
          <label htmlFor="height-field" className="bmr-label">
            Height (cm):
          </label>
          <input
            type="number"
            min="90"
            max="300"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="bmr-input"
          />
        </div>
        <div className="bmr-input-group">
          <label className="bmr-label">Gender:</label>
          <div className="bmr-radio-group">
            <label htmlFor="male-field" className="bmr-radio-label">
              Male
              <input
                id="male-field"
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={handleGenderChange}
                className="bmr-radio"
              />
            </label>
            <label htmlFor="female-field" className="bmr-radio-label">
              Female
              <input
                id="female-field"
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={handleGenderChange}
                className="bmr-radio"
              />
            </label>
          </div>
        </div>
        <button type="button" onClick={calculateBMR} className="bmr-button">
          Calculate
        </button>
      </form>
      {bmr !== null && <p className="bmr-result">Your BMR is: {bmr} kcal</p>}
    </div>
  );
}
export default BMR;

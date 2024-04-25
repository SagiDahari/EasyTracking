import { useState } from "react";

function BMR() {
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [gender, setGender] = useState("");

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  return (
    <div>
      <form className="form-control">
        <tr>
          <label for="age-field" style={{ marginRight: "10px" }}>
            Insert Age:
          </label>
          <input
            type="number"
            min="15"
            max="80"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ marginRight: "20px" }}
          />
          <label for="weight-field" style={{ marginRight: "10px" }}>
            Insert Weight (in kg):
          </label>
          <input
            type="number"
            min="0"
            max="200"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{ marginRight: "20px" }}
          />
          <label for="height-field" style={{ marginRight: "10px" }}>
            Insert Height (in cm):
          </label>
          <input
            type="number"
            min="90"
            max="300"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{ marginRight: "20px" }}
          />
          <label style={{ marginRight: "20px" }}>
            Gender:
            <label for="male-field" style={{ marginRight: "10px" }}>
              Male
            </label>
            <input
              id="male-field"
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={handleGenderChange}
              style={{ marginRight: "20px" }}
            />
            <label for="female-field" style={{ marginRight: "10px" }}>
              Female
            </label>
            <input
              id="female-field"
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={handleGenderChange}
              style={{ marginRight: "20px" }}
            />
          </label>
          <button type="button">Calculate</button>
        </tr>
      </form>
    </div>
  );
}
export default BMR;

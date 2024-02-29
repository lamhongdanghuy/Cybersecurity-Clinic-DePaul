import { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginContextProvider";
import { jwtDecode } from "jwt-decode";

function LoginSignup() {
  const { setUser } = useContext(LoginContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [showResults, setShowResults] = useState(false);

  const navigator = useNavigate();

  const sendLogin = async () => {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    const temp = jwtDecode(result);
    //////////////////
    console.log(temp);
    //////////////////
    if ("message" in temp && temp.message === "Login successful!") {
      setSuccess("Login Successful");
      if (
        "email" in temp &&
        typeof temp.email === "string" &&
        "id" in temp &&
        typeof temp.id === "string" &&
        "role" in temp &&
        typeof temp.role === "string"
      ) {
        setUser({
          token: result,
          email: temp.email,
          id: temp.id,
          role: temp.role,
        });
      }
      navigator("/dashboard");
    } else {
      setSuccess("Login Failed");
    }
    setShowResults(true);
  };

  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "35%",
          margin: "auto",
          border: "1px solid white",
          gap: ".5em",
          padding: "2em",
          borderRadius: "1em",
        }}
      >
        <>
          <h1>LOG IN</h1>
          <label htmlFor="email">Email Address:</label>
          <input
            type="text"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
          />{" "}
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
          />{" "}
          <br />
          <button onClick={sendLogin}>Log In</button>
          <br />
          <button
            style={{
              color: "gold",
              backgroundColor: "white",
              marginBottom: "2em",
            }}
            onClick={() => navigator("/apply")}
          >
            Apply
          </button>
        </>
        {showResults && (
          <div>
            <h1>{success}</h1>
          </div>
        )}
      </div>
    </>
  );
}

export default LoginSignup;

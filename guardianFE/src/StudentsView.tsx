import ApplicationCard from "./ApplicationCard";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "./LoginContextProvider";

interface studentAppViewProp {
  onClick: Function;
}

interface Student {
  F_Name: string;
  L_Name: string;
  Year_Standing: string;
  Major: string;
  gradDate: string;
  Student_ID: string;
  onClick: Function;
}

function StudentsView(props: studentAppViewProp) {
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useContext(LoginContext);
  const [applicationsList, setApplicationsList] = useState<Student[]>([]);
  console.log(applicationsList);

  useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    const response = await fetch("http://localhost:5000/getStudents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: user.token ? user.token : "",
      },
      body: JSON.stringify({ userID: user.id }),
    });
    const result = await response.json();
    setApplicationsList(result.applications);
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <h1 style={{ fontSize: "10vh" }}>Students</h1>
          <div
            style={{
              margin: "0 5vw",
              display: "flex",
              flexWrap: "wrap",
              textAlign: "center",
              overflowY: "scroll",
              maxHeight: "70vh",
              marginBottom: "5vh",
              gap: "5vh",
            }}
          >
            {applicationsList.map((student: Student) => (
              <ApplicationCard
                name={student.F_Name + " " + student.L_Name}
                studentID={student.Student_ID}
                year={student.Year_Standing}
                major={student.Major}
                gradDate={student.gradDate}
                onClick={props.onClick}
                InReview={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsView;
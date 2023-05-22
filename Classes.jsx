/* eslint-disable react/prop-types */
import { ColorModeContext, useMode } from "../../../theme";
import { useEffect, useReducer, useState, useMemo } from "react";

import { styled } from "@mui/system";
import Container from "@mui/material/Container";
import {
  AppBar,
  Tab,
  Tabs,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CircularProgress,
  Paper,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setPaymentStatus,
  togglePaymentStatus,
} from "../../../paymentStatusSlice";
import Header from "../dashboard/Header";

const StyledTabContainer = styled("div")({
  flexGrow: 1,
  backgroundColor: "#fff",
  width: "90%",
});

const CenteredContent = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const TabContainer = ({ classData, students }) => {
  const dispatch = useDispatch();
  const paymentStatus = useSelector((state) => state.paymentStatus);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getStudentsInSection = (classId, section) => {
    return students.filter(
      (student) =>
        student.ClassID.toLowerCase() === classId.toLowerCase() &&
        student.Section.toLowerCase() === section.toLowerCase()
    );
  };

  const studentsInSections = useMemo(() => {
    return classData.sections.reduce((acc, section) => {
      acc[section] = getStudentsInSection(classData.class_id, section);
      return acc;
    }, {});
  }, [classData, students]);

  useEffect(() => {
    console.log("Payment status changed", paymentStatus);
  }, [paymentStatus]);
  const handleButtonClick = (studentsInSection) => {
    const paymentStatuses = studentsInSection.map((student) => ({
      studentId: student.studentId,
      classId: classData.class_id,
      hasPaid: paymentStatus[student.studentId] || false,
      date: new Date(),
    }));
    console.log(paymentStatuses);
  };

  return (
    <StyledTabContainer>
      <AppBar position="static" color="default">
        <Typography variant="h6" align="center">
          {classData.class_id} <span> {classData.fee}</span>
        </Typography>

        <Tabs
          value={value}
          onChange={handleChange}
          // variant="scrollable"
          scrollButtons="auto"
          centered
          aria-label="Class Sections">
          {classData.sections.map((section, index) => (
            <Tab
              key={index}
              label={`${section} (${studentsInSections[section].length})`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          ))}
        </Tabs>
      </AppBar>
      {classData.sections.map((section, index) => {
        const studentsInSection = studentsInSections[section];
        console.log(
          `Students in ${classData.class_id} ${section}:`,
          studentsInSection
        );
        return (
          <TabPanel value={value} index={index} key={index}>
            <Grid container spacing={0.5} sx={{ margin: "1em auto" }}>
              {studentsInSection.map((student, index) => (
                <Grid key={index} xs={2} sm={3} md={2} lg={2}>
                  <Card
                    sx={{
                      margin: ".2em",
                    }}>
                    <Paper
                      sx={{
                        margin: ".2em",
                        backgroundColor: paymentStatus[student.Name]
                          ? "green"
                          : "default",
                      }}
                      className="paper"
                      onClick={() => {
                        console.log(
                          "Paper clicked for student: ",
                          student.Name
                        );
                        dispatch(
                          togglePaymentStatus({ studentId: student.Name })
                        );
                      }}>
                      {student.Name}
                    </Paper>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <hr />
            <Typography
              variant="p"
              sx={{ textAlign: "center", fontSize: "10px" }}>
              Number of Students
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleButtonClick(studentsInSection)}>
              Send Payment Status
            </Button>
          </TabPanel>
        );
      })}
    </StyledTabContainer>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        students: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

export default function Classes() {
  const [state, dispatch] = useReducer(reducer, {
    students: [],
    isLoading: false,
    isError: false,
  });

  const { students, isLoading } = state;

  const classData = [
    {
      class_id: "Nursery",
      fee: "1000",
      sections: ["A", "B", "C", "D", "E"],
    },
    {
      class_id: "Prep",
      fee: "1050",
      sections: ["A", "B", "C", "D"],
    },
    {
      class_id: "1st",
      fee: "1100",
      sections: ["A", "B", "C", "D"],
    },
    {
      class_id: "2nd",
      fee: "1150",
      sections: ["A", "B", "C", "D"],
    },
    {
      class_id: "3rd",
      fee: "1200",
      sections: ["A", "B", "C", "D"],
    },

    {
      class_id: "4th",
      fee: "1250",
      sections: ["A", "B", "C", "D"],
    },
    {
      class_id: "5th",
      fee: "1300",
      sections: ["A", "B", "C", "D"],
    },
    {
      class_id: "6th",
      fee: "1500",
      sections: ["A", "B", "C", "D"],
    },
    {
      class_id: "7th",
      fee: "1500",
      sections: ["A", "B", "C", "D"],
    },
    {
      class_id: "8th",
      fee: "1700",
      sections: ["A", "B", "C", "D"],
    },
    {
      class_id: "9th",
      fee: "2000",
      sections: ["A", "B"],
    },
    {
      class_id: "10th",
      fee: "2300",
      sections: ["A", "B"],
    },
  ];
  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/students");
    const data = await response.json();
    return data;
  };
  const [theme, colorMode] = useMode();

  const fetchStudents = async () => {
    dispatch({ type: "FETCH_INIT" });

    try {
      const result = await fetchData();

      dispatch({ type: "FETCH_SUCCESS", payload: result });
    } catch (error) {
      dispatch({ type: "FETCH_FAILURE" });
    }
  };

  return (
    <ColorModeContext.Provider value={{ colorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header
          sx={{ margin: "100px" }}
          title="Class Sections"
          subtitle="Students in each section"
        />
        <Container maxWidth="lg">
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <CircularProgress />
            </Box>
          ) : (
            classData.map((classItem, index) => (
              <CenteredContent key={index}>
                <TabContainer classData={classItem} students={students} />
              </CenteredContent>
            ))
          )}

          {/* Fetch students button */}
          <button onClick={fetchStudents}>Fetch Students</button>
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

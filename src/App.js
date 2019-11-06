import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Input } from "@material-ui/core";
import {
  createMuiTheme,
  MuiThemeProvider,
  makeStyles
} from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import moment from "moment";

import DataTable from "./DataTable";

const theme = createMuiTheme({
  palette: {
    primary: red
  }
});

const useStyles = makeStyles(theme => ({
  tool: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

function App() {
  const classes = useStyles();

  const format = "DD/MM/YYYY";
  const limitDate = moment("2020-12-31");

  const [employees, setEmployees] = useState([]);
  const [input, setInput] = useState("");

  const calculateDayOff = newEmployees => {
    let calculatedEmployees = newEmployees;
    console.log(newEmployees);
    calculatedEmployees.forEach((e, index, originalArray) => {
      let currDate = moment()
        .day(6)
        .subtract(7, "d")
        .add(7 * (index + 1), "d");
      e.dayOff = [];
      while (currDate < limitDate) {
        e.dayOff.push(currDate.format(format));
        currDate.add(7 * originalArray.length, "d");
      }
    });
    return calculatedEmployees;
  };

  const remove = emp => {
    setEmployees(calculateDayOff(employees.filter(e => e.name !== emp)));
  };

  const add = emp => {
    if (emp) {
      let newEmployees = [...employees, { name: emp, dayOff: [] }];
      setEmployees(calculateDayOff(newEmployees));
    }
    setInput("");
  };

  return (
    <MuiThemeProvider theme={theme}>
      <React.Fragment>
        <AppBar position="static">
          <Toolbar className={classes.tool}>
            <Typography type="title" color="inherit">
              Agenda de folgas
            </Typography>
          </Toolbar>
        </AppBar>
        Novo empregado:{" "}
        <Input onChange={e => setInput(e.target.value)} value={input} />
        <Button onClick={() => add(input)}>Adicionar</Button>
        <ul>
          {employees.map(emp => (
            <li key={emp.name}>
              {emp.name}{" "}
              <Button onClick={() => remove(emp.name)}>Remover</Button>
            </li>
          ))}
        </ul>
        <DataTable data={employees} />
      </React.Fragment>
    </MuiThemeProvider>
  );
}

export default App;

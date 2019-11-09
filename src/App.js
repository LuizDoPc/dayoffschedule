import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Input,
  Select,
  FormControl,
  InputLabel
} from "@material-ui/core";
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

const limitDate = moment("2020-12-31");
const format = "DD/MM/YYYY";

function App() {
  const classes = useStyles();

  const [adm, setAdm] = useState([]);
  const [inputAdm, setInputAdm] = useState("");

  const [exp, setExp] = useState([]);
  const [inputExp, setInputExp] = useState("");

  const [com, setCom] = useState([]);
  const [inputCom, setInputCom] = useState("");

  const [folgas, setFolgas] = useState({});

  const [edit, setEdit] = useState("");
  const [sector, setSector] = useState(0);
  const [oldName, setOldName] = useState(0);

  const calculateDayOff = newEmployees => {
    let calculatedEmployees = newEmployees;
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

  const removeAdm = emp => {
    setAdm(calculateDayOff(adm.filter(e => e.name !== emp)));
  };

  const addAdm = emp => {
    if (emp) {
      let newEmployees = [...adm, { name: emp, dayOff: [] }];
      setAdm(calculateDayOff(newEmployees));
    }
    setInputAdm("");
  };

  const removeExp = emp => {
    setExp(calculateDayOff(exp.filter(e => e.name !== emp)));
  };

  const addExp = emp => {
    if (emp) {
      let newEmployees = [...exp, { name: emp, dayOff: [] }];
      setExp(calculateDayOff(newEmployees));
    }
    setInputExp("");
  };

  const removeCom = emp => {
    setCom(calculateDayOff(com.filter(e => e.name !== emp)));
  };

  const addCom = emp => {
    if (emp) {
      let newEmployees = [...com, { name: emp, dayOff: [] }];
      setCom(calculateDayOff(newEmployees));
    }
    setInputCom("");
  };

  const getFolgasAux = (emp, mes) => {
    const employees = [];
    emp.forEach(e => {
      const aux = e.dayOff.filter(f => {
        let temp = f.split("/");
        if (temp[1] === mes) return true;
        return false;
      });
      employees.push({ name: e.name, dayOff: aux });
    });
    return employees;
  };

  const getFolgas = mes => {
    const newFolgas = {};

    newFolgas["Administrativo"] = getFolgasAux(adm, mes);
    newFolgas["Expedição"] = getFolgasAux(exp, mes);
    newFolgas["Comercial"] = getFolgasAux(com, mes);

    setFolgas(newFolgas);
  };

  const renderOptions = () => {
    return combine[sector].map(e => (
      <option value={e.name} style={{ cursor: "pointer" }}>
        {e.name}
      </option>
    ));
  };

  const combine = [adm, exp, com];

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
        <h1>Setor Administrativo</h1>
        Novo empregado:{" "}
        <Input onChange={e => setInputAdm(e.target.value)} value={inputAdm} />
        <Button onClick={() => addAdm(inputAdm)}>Adicionar</Button>
        <ul>
          {adm.map(emp => (
            <li key={emp.name}>
              {emp.name}{" "}
              <Button onClick={() => removeAdm(emp.name)}>Remover</Button>
            </li>
          ))}
        </ul>
        <DataTable data={adm} />
        <h1>Setor Expedição</h1>
        Novo empregado:{" "}
        <Input onChange={e => setInputExp(e.target.value)} value={inputExp} />
        <Button onClick={() => addExp(inputExp)}>Adicionar</Button>
        <ul>
          {exp.map(emp => (
            <li key={emp.name}>
              {emp.name}{" "}
              <Button onClick={() => removeExp(emp.name)}>Remover</Button>
            </li>
          ))}
        </ul>
        <DataTable data={exp} />
        <h1>Setor Comercial</h1>
        Novo empregado:{" "}
        <Input onChange={e => setInputCom(e.target.value)} value={inputCom} />
        <Button onClick={() => addCom(inputCom)}>Adicionar</Button>
        <ul>
          {com.map(emp => (
            <li key={emp.name}>
              {emp.name}{" "}
              <Button onClick={() => removeCom(emp.name)}>Remover</Button>
            </li>
          ))}
        </ul>
        <DataTable data={com} />
        <h1>CONSULTAS</h1>
        <h3>Folgas no mês</h3>
        <Button onClick={() => getFolgas("01")}>Jan</Button>
        <Button onClick={() => getFolgas("02")}>Fev</Button>
        <Button onClick={() => getFolgas("03")}>Mar</Button>
        <Button onClick={() => getFolgas("04")}>Abr</Button>
        <Button onClick={() => getFolgas("05")}>Mai</Button>
        <Button onClick={() => getFolgas("06")}>Jun</Button>
        <Button onClick={() => getFolgas("07")}>Jul</Button>
        <Button onClick={() => getFolgas("08")}>Ago</Button>
        <Button onClick={() => getFolgas("09")}>Set</Button>
        <Button onClick={() => getFolgas("10")}>Out</Button>
        <Button onClick={() => getFolgas("11")}>Nov</Button>
        <Button onClick={() => getFolgas("12")}>Dez</Button>
        {Object.entries(folgas).map(([setor, func]) => (
          <>
            <h3>{setor}</h3>
            {func.map(e => (
              <>
                <h4>{e.name}</h4>
                <div>
                  {e.dayOff.reduce((acc, data, index) => {
                    if (index !== e.dayOff.length - 1)
                      return (acc += `${data}, `);
                    return (acc += data);
                  }, " ")}
                </div>
              </>
            ))}
          </>
        ))}
        <h1>Editar</h1>
        <FormControl style={{ width: "50%" }}>
          <InputLabel htmlFor="edit-select">Selecione o setor</InputLabel>
          <Select
            inputProps={{ name: "edit", id: "edit-select" }}
            value={sector}
            onChange={e => setSector(e.target.value)}
          >
            <option value="0" style={{ cursor: "pointer" }}>
              Administrativo
            </option>
            <option value="1" style={{ cursor: "pointer" }}>
              Expedição
            </option>
            <option value="2" style={{ cursor: "pointer" }}>
              Comercial
            </option>
          </Select>
        </FormControl>
        <FormControl style={{ width: "50%" }}>
          <InputLabel htmlFor="func-select">Selecione o funcionário</InputLabel>
          <Select
            inputProps={{ name: "select-func", id: "func-select" }}
            value={oldName}
            onChange={e => setOldName(e.target.value)}
          >
            {renderOptions()}
          </Select>
        </FormControl>
        Novo nome:{" "}
        <Input value={edit} onChange={e => setEdit(e.target.value)} />
        <Button
          onClick={() => {
            const newArr = combine[sector];
            newArr.forEach(e => {
              if (e.name === oldName) {
                e.name = edit;
              }
            });
            if (sector === 0) setAdm(newArr);
            else if (sector === 1) setExp(newArr);
            else setCom(newArr);

            setEdit("");
          }}
        >
          Confirmar
        </Button>
      </React.Fragment>
    </MuiThemeProvider>
  );
}

export default App;

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

const DataTable = ({ data }) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Nome</b>
            </TableCell>
            <TableCell>
              <b>Folgas</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.dayOff.map(day => `${day}, `)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default DataTable;

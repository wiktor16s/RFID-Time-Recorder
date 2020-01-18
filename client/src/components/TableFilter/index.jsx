import React from "react";
import "./styles.css";

const TableFilter = props => {
  let date = new Date();
  let propsFilter;
  let filter;

  if (props.filter.date) {
    filter = {
      day: props.filter.date.getDate(),
      month: props.filter.date.getMonth() + 1,
      year: props.filter.date.getFullYear()
    };
    if (filter.day < 10) {
      filter.day = "0" + filter.day;
    }
    if (filter.month < 10) {
      filter.month = "0" + filter.month;
    }
  } else {
    filter = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }
  //console.log(props.filter.event);
  propsFilter = props.data.filter((value, index) => {
    //return value.date === "04.1997"
    if (props.showAllMonth) {
      if (props.filter.event == "startOfWork") {
        return (
          value.closeupEvent == "startOfWork" &&
          value.date === filter.month + "." + filter.year &&
          value.userID === props.worker.id
        );
      } else if (props.filter.event == "outOfWork") {
        return (
          value.closeupEvent == "outOfWork" &&
          value.date === filter.month + "." + filter.year &&
          value.userID === props.worker.id
        );
      } else {
        return (
          value.date === filter.month + "." + filter.year &&
          value.userID === props.worker.id
        );
      }
    } else {
      if (props.filter.event == "startOfWork") {
        return (
          value.closeupEvent == "startOfWork" &&
          value.day === filter.day &&
          value.date === filter.month + "." + filter.year &&
          value.userID === props.worker.id
        );
      } else if (props.filter.event == "outOfWork") {
        return (
          value.closeupEvent == "outOfWork" &&
          value.day === filter.day &&
          value.date === filter.month + "." + filter.year &&
          value.userID === props.worker.id
        );
      } else {
        return (
          value.day === filter.day &&
          value.date === filter.month + "." + filter.year &&
          value.userID === props.worker.id
        );
      }
    }
  });

  return (
    <div className="no-print">
      <table className="table">
        <thead>
          <tr className="table__row table__row--header">
            {props.columns.map(column => (
              <th
                key={column.header}
                className="table__cell table__cell--header"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {propsFilter.map((rowData, index) => {
            return (
              <tr key={index} className="table__row">
                {props.columns.map(column => (
                  <td
                    key={`${column.header}-${rowData.id}`}
                    className="table__cell"
                  >
                    {column.cell(rowData)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableFilter;

import React from "react";
import "./styles.css";

const Table = props => {
  console.log("tabela: ", props);
  return (
    <div>
      <table className="table">
        <thead>
          <tr className="table__row table__row--header">
            {props.columns.map(column => (
              <th
                key={column.header}
                className={`table__cell table__cell--header table__cell-${column.header}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-main">
          {props.data.map((rowData, index) => (
            <tr
              onClick={() => {
                props.action({
                  name: rowData.userName,
                  id: rowData.userID,
                  key: index
                });
              }}
              key={index}
              className="table__row"
            >
              {props.columns.map(column => (
                <td
                  key={`${column.header}-${rowData.id}`}
                  className={`table__cell table__cell-${column.header}`}
                >
                  {column.cell(rowData)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

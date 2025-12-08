import React from 'react';
import './Table.scss';

interface Column<T> {
  header: string | React.ReactNode;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends { id?: number | string }>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
}: TableProps<T>) {
  if (loading) {
    return <div className="table-loading">Cargando...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table__head">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={`table__header ${column.className || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {data.map((item, rowIndex) => (
            <tr key={item.id || rowIndex} className="table__row">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`table__cell ${column.className || ''}`}>
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : String(item[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

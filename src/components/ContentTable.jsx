import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

function TableComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
        const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      //const response = await fetch('http://44.211.152.124:8080/media_library/content', { headers });
      const response = await fetch('http://localhost:8080/media_library/content', { headers });
      const jsonData = await response.json();
      setData(jsonData);
    }
    fetchData();
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>contentName</th>
          <th>contentLocation</th>
          <th>contentType</th>
          <th>isFile</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
             <td>{row.id}</td>
            <td>{row.contentName}</td>
            <td>{row.contentLocation}</td>
            <td>{row.contentType}</td>
            <td>{row.file}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TableComponent;

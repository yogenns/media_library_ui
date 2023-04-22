import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { API_URL } from './config.js'


function Checkbox({ id, label, checked, onChange }) {
  return (
    <>
      <label htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={onChange} /> {label}
      </label>
    </>
  );
}

function Analysis() {

  const [storageTypes, setStorageTypes] = useState([]);
  const [selectedStorageType, setSelectedStorageType] = useState(null);
  const [tableData, setTableData] = useState([]);
  const basicAuthToken = localStorage.getItem('basicAuthToken');
  const headers = {
    Authorization: 'Basic ' + basicAuthToken
  };
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FFAA19', '#FF1919', '#19B2FF', '#1978FF', '#B919FF', '#FF1994'];

  const [data, setData] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  useEffect(() => {
    fetchData(selectedCheckboxes);
  }, []);

  useEffect(() => {
    fetchCheckBoxData();
  }, []);
  const fetchCheckBoxData = () => {
    var URL = `${API_URL}/storage`;
    fetch(URL, { headers })
      .then((response) => response.json())
      .then((data) => {
        const modifiedData = data.map(({ id, storageName }) => ({ id, storageName }));
        setCheckboxes([{ id: -1, storageName: "ALL" }, ...modifiedData])
      });
  };
  const handleCheckboxChange = (id, checked) => {
    let newSelectedCheckboxes = [...selectedCheckboxes];
    if (id === -1) {
      setAllChecked(checked);
      newSelectedCheckboxes = checked ? checkboxes.map(item => item.id) : [];
    } else {
      const storageId = checkboxes.find(item => item.id === id)?.id;
      const index = newSelectedCheckboxes.indexOf(storageId);
      if (checked && index === -1) {
        newSelectedCheckboxes.push(storageId);
      } else if (!checked && index !== -1) {
        newSelectedCheckboxes.splice(index, 1);
        newSelectedCheckboxes = newSelectedCheckboxes.filter((elem) => elem !== -1);
        setAllChecked(false);
      }
    }
    setSelectedCheckboxes(newSelectedCheckboxes);
  };

  const fetchData = (selected) => {
    const dataArg = selected.length === checkboxes.length ? "" : selected.join(",");
    var URL = `${API_URL}/analysis/duplicate`;
    if (dataArg) {
      URL += `?storageList=${dataArg}`
    }
    fetch(URL, { headers })
      .then((response) => response.json())
      .then((data) => setData(data));
  };

  const handleButtonClick = () => {
    fetchData(selectedCheckboxes);
  };

  const checkboxItems = checkboxes.map(({ id, storageName: label }) => (
    <Checkbox
      key={id}
      label={label}
      checked={id === -1 ? allChecked : selectedCheckboxes.includes(id)}
      onChange={(e) => handleCheckboxChange(id, e.target.checked)}
    />
  ));


  useEffect(() => {
    fetch(`${API_URL}/storage`, { headers })
      .then((response) => response.json())
      .then((data) => setStorageTypes(data))
      .catch((error) =>
        console.error("Error fetching storage types:", error)
      );
  }, []);

  // Simulating API call to fetch table data
  useEffect(() => {
    console.log(selectedStorageType)
    if (selectedStorageType) {
      fetch(`${API_URL}/analysis?storageId=${selectedStorageType.id}`, { headers })
        .then((response) => response.json())
        .then((data) => { setTableData(data); console.log(data) })
        .catch((error) =>
          console.error("Error fetching table data:", error)
        );
    } else {
      fetch(`${API_URL}/analysis`, { headers })
        .then((response) => response.json())
        .then((data) => { setTableData(data); console.log(data) })
        .catch((error) =>
          console.error("Error fetching table data:", error)
        );
    }
  }, [selectedStorageType]);

  const handleStorageTypeChange = (e) => {
    const selectedType = storageTypes.find(
      (type) => type.id === parseInt(event.target.value)
    );
    setSelectedStorageType(selectedType);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
          <label htmlFor="storage-type">Storage Type</label>
          <select name="storage-type" id="storage-type" onChange={handleStorageTypeChange}>
            <option value="">Select a storage type</option>
            {storageTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.storageName}
              </option>
            ))}
          </select>


          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Type</th>
                <th>File</th>

              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData) => (
                <tr key={rowData.storageType}>
                  <td>{rowData.storageType}</td>
                  <td>{rowData.fileCount}</td>

                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
          <PieChart width={400} height={400}>
            <Legend verticalAlign="top" height={36} />
            <Tooltip />
            <Pie
              data={tableData}
              dataKey="fileCount"
              nameKey="storageType"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {tableData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
      <div className="container">

        <div className="checkbox-group">{checkboxItems}
          <button className="btn" onClick={handleButtonClick}>
            Find Duplicates
          </button>
        </div>
        <br />

        <table className="table caption-top">
          <caption>Duplicates Table</caption>
          <thead>
            <tr>
              <th>Content Name</th>
              <th>Content Count</th>
              <th>Content Path</th>
              <th>Storage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.contentName}</td>
                <td>{item.contentCount}</td>
                <td>{item.contentPath.map((item, index) => {
                  if (index === 0) {
                    return <>{item}</>
                  }
                  return <><br />{item}</>
                })}</td>
                <td>{item.storage.map((item, index) => {
                  if (index === 0) {
                    return <>{item}</>
                  }
                  return <><br />{item}</>
                })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </>
  );
}

export default Analysis;


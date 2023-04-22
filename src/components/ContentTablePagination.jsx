import React, { useState, useEffect } from 'react';
import { Table, Pagination, Form } from 'react-bootstrap';
import { API_URL } from './config'

function ContentTablePagination() {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState({});

    const [dropdownValues, setDropdownValues] = useState([]);
    const [storageDropdownValues, setStorageDropdownValues] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedStorage, setSelectedStorage] = useState("");
    useEffect(() => {

        const basicAuthToken = localStorage.getItem('basicAuthToken');
        const headers = {
            Authorization: 'Basic ' + basicAuthToken
          };
        fetch(`${API_URL}/content-types`, { headers })
            .then((response) => response.json())
            .then((data) => setDropdownValues(data.contentTypes))
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {

        const basicAuthToken = localStorage.getItem('basicAuthToken');
        const headers = {
            Authorization: 'Basic ' + basicAuthToken
          };
        fetch(`${API_URL}/storage`, { headers })
            .then((response) => response.json())
            .then((data) => setStorageDropdownValues(data.map(item => item.storageName)))
            .catch((error) => console.error(error));
    }, []);

    const fetchData = async (page) => {
        const basicAuthToken = localStorage.getItem('basicAuthToken');
        const headers = {
            Authorization: 'Basic ' + basicAuthToken
          };
        let url = `${API_URL}/content?page=${page}&size=20`;
        if (filters.column1) {
            url += `&contentName=${filters.column1}`;
        }
        if (selectedType) {
            url += `&contentType=${selectedType}`;
        }
        if (selectedStorage) {
            url += `&storageName=${selectedStorage}`;
        }
        //console.log(url);
        const response = await fetch(url, { headers });
        const jsonData = await response.json();
        setData(jsonData.content);
        setTotalPages(jsonData.totalPages);
        setCurrentPage(jsonData.number);
    };



    useEffect(() => {
        fetchData(0);
    }, [filters, selectedType,selectedStorage]);

    const handlePageChange = (page) => {
        fetchData(page);
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const maxPageNumbers = 10; // Maximum number of page numbers to show

    const startPage = Math.max(0, Math.min(currentPage - Math.floor(maxPageNumbers / 2), totalPages - maxPageNumbers));
    const endPage = Math.min(totalPages - 1, startPage + maxPageNumbers - 1);
    return (
        <>
            <div>
                <Table striped bordered hover responsive style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>content Name 
                                <br/>
                                <input
                                type="text"
                                onChange={(event) =>
                                    setFilters({
                                        ...filters,
                                        column1: event.target.value,
                                    })
                                }
                            /></th>
                            <th>content Location</th>
                            <th>Content Type
                                <br />

                                <Form.Select
                                    value={selectedType}
                                    onChange={(event) => setSelectedType(event.target.value)}>
                                    <option value="">Select a value</option>
                                    {dropdownValues.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </Form.Select>

                            </th>
                            <th>Storage Name
                                <br />
                                <Form.Select
                                    value={selectedStorage}
                                    onChange={(event) => setSelectedStorage(event.target.value)}>
                                    <option value="">Select a value</option>
                                    {storageDropdownValues.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </Form.Select>

                            </th>
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
                                <td>{row.storageName}</td>
                                <td>{row.file}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Pagination>
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    />
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((number) => (
                        <Pagination.Item
                            key={number}
                            active={number === currentPage}
                            onClick={() => handlePageChange(number)}
                        >
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    />
                </Pagination>
            </div>
        </>
    );
}

export default ContentTablePagination;

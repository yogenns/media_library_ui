import { useState, useEffect } from 'react';
import { Table, Pagination, Form } from 'react-bootstrap';
import { API_URL } from './config'
import ConfirmationDialog from './ConfirmationDialog';
function WishList() {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(true);

    const basicAuthToken = localStorage.getItem('basicAuthToken');
    const headers = {
        Authorization: 'Basic ' + basicAuthToken
    };

    // Fetch the list of items on component mount and whenever the items are updated
    useEffect(() => {
        if (isFormSubmitted) {
        fetch(`${API_URL}/wishlist`, { headers })
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching wish list:', error));
            setIsFormSubmitted(false);
        }
    }, [isFormSubmitted]);

    // Handler for the form submit event
    const handleSubmit = (event) => {
        event.preventDefault();

        const requestUrl = `${API_URL}/wishlist`;
        const requestMethod = selectedItem ? 'PUT' : 'POST';
        const requestHeaders = {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + basicAuthToken
        };
        const requestBody = selectedItem ? JSON.stringify({ "id":selectedItem.id,name, url }): JSON.stringify({ name, url });
         

        fetch(requestUrl, {
            method: requestMethod,
            headers: requestHeaders,
            body: requestBody
            
        })
            .then(() => {
                // Reset the form fields and selected item after a successful request
                setName('');
                setUrl('');
                setSelectedItem(null);
                setIsFormSubmitted(true);
            })
            .catch(error => console.error('Error submitting wish list item:', error));
    };

    // Handler for the delete button click event
    const handleDelete = (id) => {
        setSelectedItem(items.find(item => item.id === id));
        setShowConfirmationModal(true);
    };

    const handleCancelDelete = () => {
        setShowConfirmationModal(false);
        setSelectedItem(null);
      };

    // Handler for the confirmation modal's delete button click event
    const handleDeleteConfirmed = () => {
        const requestUrl = `${API_URL}/wishlist/${selectedItem.id}`;

        fetch(requestUrl, {
            method: 'DELETE',
            headers: {Authorization: 'Basic ' + basicAuthToken}
        })
            .then(() => {
                setShowConfirmationModal(false);
                setSelectedItem(null);
                setIsFormSubmitted(true);
            })
            .catch(error => console.error('Error deleting wish list item:', error));
    };

    // Handler for the edit button click event
    const handleEdit = (id) => {
        const selectedItem = items.find(item => item.id === id);
        setName(selectedItem.name);
        setUrl(selectedItem.url);
        setSelectedItem(selectedItem);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} />

                    <label htmlFor="url">URL:</label>
                    <input type="text" id="url" value={url} onChange={(event) => setUrl(event.target.value)} />

                    <button type="submit">{selectedItem ? 'Update' : 'Add'}</button>
                </div>
            </form>

            <Table striped bordered hover responsive style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>URL</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></td>
                            <td><button className="btn-edit" onClick={() => handleEdit(item.id)}>Edit</button></td>
                            <td><button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            
            {showConfirmationModal && (
                
                <ConfirmationDialog
                    show={showConfirmationModal}
                    handleClose={!showConfirmationModal}
                    className="confirmation-dialog"
                    title="Delete Item"
                    message={`Are you sure you want to delete ?`}
                    confirmLabel="Delete"
                    handleConfirm={handleDeleteConfirmed}
                    handleCancel={handleCancelDelete}
                />
            )}
        </div>

    );
}

export default WishList;
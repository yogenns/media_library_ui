import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config'
import '../App.css'

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigateTo = useNavigate();


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
        const response = await fetch(`${API_URL}/content-types`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            }
        });
        console.log(response.ok);
        if (response.ok) {
            localStorage.setItem('basicAuthToken', btoa(username + ':' + password));
            console.log("nav");
            navigateTo('/');
            props.onLogin();
        } else {
            console.log("err");
            alert('Invalid credentials');
        }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <button type="submit">Log in</button>
    </form>
  );
};

export default Login;

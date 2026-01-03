import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import loginBg from '../../assets/login-bg.jpg'; 
import formBg from '../../assets/formlogin.png';
import { adminLogin } from '../../api/services/login';

const LoginPage = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();   
    setError('');

    try {
      const data = await adminLogin(identifier, password);
      localStorage.setItem("token" , data.token)
      navigate('/houses'); 
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div
        className="login-card"
        style={{ backgroundImage: `url(${formBg})` }}
      >
        <h2>Log In</h2>

        <form onSubmit={handleSubmit}>
          <label className="field-label">USER</label>
          <input
            className="field-input"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label className="field-label">PASSWORD</label>
          <input
            className="field-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

            {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="btn-center">
            <button type="submit" className="primary-btn full-width">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

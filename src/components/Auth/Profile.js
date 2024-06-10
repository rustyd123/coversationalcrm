import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('User data fetched:', response.data); // Add this line to debug
        setUser(response.data);
        setFormData({
          email: response.data.email,
          password: ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEditing(false);
      // Optionally, refetch user data
      const response = await axios.get('http://localhost:3001/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>Email: {user.email}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default Profile;



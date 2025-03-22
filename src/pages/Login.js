import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-black.svg'
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login , setToken} = useAuth();
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.email){
        toast.error('Email is required');   
        return;
    }
    if(!formData.password){
        toast.error('Password is required');
        return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      if(data.status){
        toast.success(data.message || 'Login successful!');
        login(data.data);
        setToken(data.token);
        navigate('/');
      }else{
        toast.error(data.message || 'Failed to login. Please try again.');
      }

      // You might want to redirect to login page or handle successful signup
    } catch (error) {
      toast.error('Failed to login. Please try again.');
      console.error('Login error:', error);
    }
  };
  return (
    <div className="custom-scrollbar min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className='flex items-center justify-center mx-auto'>
          <img src={logo} className='h-12 w-auto' />
        </div>
        <h2 className=" text-center text-sm  text-gray-900 mt-3">
          Login to your account
        </h2>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder='Enter your password'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white primary-bg focus:outline-none "
            >
              Login
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default Login;

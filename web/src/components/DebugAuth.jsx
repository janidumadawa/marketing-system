import React from 'react';

const DebugAuth = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded-lg z-50">
      <h3 className="font-bold">Debug Auth Info:</h3>
      <p>User: {user?.username || 'None'}</p>
      <p>Token: {user?.token ? 'Present' : 'Missing'}</p>
      <p>Token length: {user?.token?.length || 0}</p>
      <button 
        onClick={() => {
          localStorage.removeItem('user');
          window.location.href = '/auth';
        }}
        className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
      >
        Clear & Relogin
      </button>
    </div>
  );
};

export default DebugAuth;
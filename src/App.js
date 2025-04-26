import React from 'react';
import './App.css'; // You can keep this or customize it
import FileUpload from './components/FileUpload'; // Import the FileUpload component

function App() {
  return (
    <div className="App">
      <h1>Welcome to the File Sharing App</h1>
      <FileUpload /> {/* Render the FileUpload component */}
    </div>
  );
}

export default App;

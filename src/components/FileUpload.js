import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false); // For loading indicator
    const [errorMessage, setErrorMessage] = useState(''); // For error messages

    // Allowed file types for upload (you can adjust this as per your needs)
    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    // Handle file selection
    const onFileChange = (e) => {
        const file = e.target.files[0];

        if (file && allowedFileTypes.includes(file.type)) {
            setSelectedFile(file);
            setErrorMessage(''); // Clear error message if file type is valid
        } else {
            setErrorMessage('Invalid file type. Only JPEG, PNG, and PDF files are allowed.');
        }
    };

    // Upload file
    const uploadFile = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        setLoading(true); // Show loading indicator
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert(res.data.message);
            fetchFiles(); // Refresh the file list after successful upload
            setSelectedFile(null); // Reset the selected file
        } catch (err) {
            console.error(err);
            setErrorMessage('Error uploading file. Please try again.');
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    // Fetch list of files
    const fetchFiles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/files');
            setFiles(res.data);
        } catch (err) {
            console.error(err);
            setErrorMessage('Error fetching files. Please try again.');
        }
    };

    // Download file
    const downloadFile = (id) => {
        window.location.href = `http://localhost:5000/files/${id}`;
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div>
            <h1>File Sharing App</h1>

            <div>
                <input type="file" onChange={onFileChange} />
                <button onClick={uploadFile} disabled={loading || !selectedFile}>Upload</button>
                {loading && <p>Uploading...</p>} {/* Show loading text */}
            </div>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}

            <h2>Files</h2>
            <ul>
                {files.map((file) => (
                    <li key={file._id}>
                        <span>{file.name}</span>
                        <button onClick={() => downloadFile(file._id)}>Download</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileUpload;

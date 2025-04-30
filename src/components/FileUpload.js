import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file && allowedFileTypes.includes(file.type)) {
            setSelectedFile(file);
            setErrorMessage('');
        } else {
            setErrorMessage('Only JPEG, PNG, and PDF files are allowed.');
        }
    };

    const uploadFile = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await axios.post('https://backend-vso8.onrender.com/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert(res.data.message);
            fetchFiles(); // Fetch the updated file list
            setSelectedFile(null);
        } catch (err) {
            console.error('Upload error:', err);
            setErrorMessage('Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchFiles = async () => {
        try {
            const res = await axios.get('https://backend-vso8.onrender.com/files');
            setFiles(res.data);
        } catch (err) {
            console.error('Fetching error:', err);
            setErrorMessage('Could not fetch file list.');
        }
    };

    const downloadFile = (id) => {
        window.location.href = `https://backend-vso8.onrender.com/files/${id}`;
    };

    const deleteFile = async (fileName) => {
        try {
            console.log(`Attempting to delete file with name: ${fileName}`);
            const res = await axios.delete(`https://backend-vso8.onrender.com/files/deleteByName/${encodeURIComponent(fileName)}`);
            alert('File deleted successfully');
            fetchFiles(); // Refresh the file list
        } catch (err) {
            console.error('Delete error:', err);
            setErrorMessage('Could not delete file. Please try again.');
        }
    };

    useEffect(() => {
        fetchFiles(); // Fetch the list of files when the component mounts
    }, []);

    return (
        <div>
            <h1>File Sharing App</h1>

            <input type="file" onChange={onFileChange} />
            <button onClick={uploadFile} disabled={loading || !selectedFile}>Upload</button>
            {loading && <p>Uploading...</p>}

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <h2>Files</h2>
            <ul>
                {files.length > 0 ? (
                    files.map((file) => (
                        <li key={file._id}>
                            <span>{file.name}</span>
                            <button onClick={() => downloadFile(file._id)}>Download</button>
                            <button 
                                onClick={() => deleteFile(file.name)} 
                                style={{ color: 'red', marginLeft: '10px' }}
                            >
                                Delete
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No files uploaded yet.</p>
                )}
            </ul>
        </div>
    );
};

export default FileUpload;

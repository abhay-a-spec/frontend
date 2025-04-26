import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false); // For loading indicator
    const [errorMessage, setErrorMessage] = useState(''); // For error messages

    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    const onFileChange = (e) => {
        const file = e.target.files[0];

        if (file && allowedFileTypes.includes(file.type)) {
            setSelectedFile(file);
            setErrorMessage('');
        } else {
            setErrorMessage('Invalid file type. Only JPEG, PNG, and PDF files are allowed.');
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
            fetchFiles();
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
            setErrorMessage('Error uploading file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchFiles = async () => {
        try {
            const res = await axios.get('https://backend-vso8.onrender.com/files');
            setFiles(res.data);
        } catch (err) {
            console.error(err);
            setErrorMessage('Error fetching files. Please try again.');
        }
    };

    const downloadFile = (id) => {
        window.location.href = `https://backend-vso8.onrender.com/files/${id}`;
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
                {loading && <p>Uploading...</p>}
            </div>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

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

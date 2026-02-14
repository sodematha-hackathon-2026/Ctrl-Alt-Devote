import React, { useState } from 'react';
import { uploadFileToS3 } from '../services/s3Service';
import './FileUpload.css';

interface FileUploadProps {
    onUploadSuccess: (url: string) => void;
    label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, label = "Upload Image" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Basic validation for images
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG, etc).');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const url = await uploadFileToS3(file);
            onUploadSuccess(url);
        } catch (err) {
            setError('Failed to upload file. Please try again.');
            console.error(err);
        } finally {
            setUploading(false);
            // Reset input value to allow selecting the same file again if needed
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    return (
        <div className="file-upload-container">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <button
                type="button"
                className="file-upload-btn"
                onClick={handleButtonClick}
                disabled={uploading}
            >
                {uploading ? 'Uploading...' : label}
            </button>
            {error && <p className="file-upload-error">{error}</p>}
        </div>
    );
};

export default FileUpload;

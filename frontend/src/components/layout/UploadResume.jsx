import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import './UploadResume.css';

const UploadResume = ({ onUpload, isUploading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileStatus, setFileStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  
  // Sync external uploading state (fallback cleanup)
  useEffect(() => {
    if (isUploading) {
      if (fileStatus === 'idle') {
        setFileStatus('uploading');
      }
    } else {
      if (fileStatus === 'uploading') {
        setFileStatus('idle');
      }
    }
  }, [isUploading]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isUploading) return;
    
    const file = e.dataTransfer.files?.[0];
    validateAndUpload(file);
  };

  const handleFileSelect = (e) => {
    if (isUploading) return;
    
    const file = e.target.files?.[0];
    validateAndUpload(file);
  };

  const validateAndUpload = async (file) => {
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setFileStatus('error');
      setFileName('Invalid file type (PDF only)');
      setTimeout(() => setFileStatus('idle'), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileStatus('error');
      setFileName('File too large (Max 5MB)');
      setTimeout(() => setFileStatus('idle'), 3000);
      return;
    }

    setFileName(file.name);
    setFileStatus('uploading');
    const success = await onUpload(file);
    
    if (success) {
      setFileStatus('success');
    } else {
      setFileStatus('error');
      setFileName('Network or Server Error');
    }
    
    setTimeout(() => {
      setFileStatus('idle');
      setFileName('');
    }, 3000);
  };

  return (
    <div className="upload-resume-wrapper">
      <div 
        className={`upload-dropzone-card 
          ${isDragging ? 'dragging' : ''} 
          ${fileStatus === 'uploading' ? 'uploading' : ''}
          ${fileStatus === 'success' ? 'success' : ''}
          ${fileStatus === 'error' ? 'error' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (fileStatus === 'idle' || fileStatus === 'error') {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden-file-input"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={fileStatus === 'uploading'}
        />

        <div className="upload-content">
          {fileStatus === 'idle' && (
            <>
              <div className="upload-icon-circle">
                <UploadCloud size={24} />
              </div>
              <div className="upload-text-group">
                <span className="upload-primary-text">Click or drag and drop</span>
                <span className="upload-secondary-text">PDF (Max 5MB)</span>
              </div>
            </>
          )}

          {fileStatus === 'uploading' && (
            <>
              <div className="upload-icon-circle uploading">
                <Loader2 size={24} className="spin-icon" />
              </div>
              <div className="upload-text-group">
                <span className="upload-primary-text text-primary">Analyzing...</span>
                <span className="upload-secondary-text">{fileName}</span>
              </div>
            </>
          )}

          {fileStatus === 'success' && (
            <>
              <div className="upload-icon-circle success">
                <CheckCircle2 size={24} />
              </div>
              <div className="upload-text-group">
                <span className="upload-primary-text text-success">Upload Complete</span>
                <span className="upload-secondary-text">{fileName}</span>
              </div>
            </>
          )}

          {fileStatus === 'error' && (
            <>
              <div className="upload-icon-circle error">
                <AlertCircle size={24} />
              </div>
              <div className="upload-text-group">
                <span className="upload-primary-text text-error">Upload Failed</span>
                <span className="upload-secondary-text">{fileName}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;

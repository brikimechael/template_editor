import React, { useState } from 'react';
import { FileText, Upload, Loader2, Languages } from 'lucide-react';

const ResumeTranslator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [translatedFile, setTranslatedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];

    if (!uploadedFile) {
      setError('No file selected');
      return;
    }

    if (uploadedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setFile(uploadedFile);
    setError(null);
  };

  const handleTranslate = async () => {
    if (!file) {
      setError('Please upload a PDF file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_language', 'fr');

      await new Promise<void>((resolve) => setTimeout(resolve, 2000));

      const translatedFileName = file.name.replace('.pdf', '_fr.pdf');
      const mockTranslatedFile = new File([file], translatedFileName, { type: 'application/pdf' });

      setTranslatedFile(mockTranslatedFile);
    } catch (err) {
      setError('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (translatedFile) {
      const url = URL.createObjectURL(translatedFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = translatedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <Languages className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Resume Translator</h2>
      </div>

      <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="text-gray-500" size={32} />
          <span className="text-gray-600">
            {file ? file.name : 'Upload PDF Resume'}
          </span>
        </label>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={handleTranslate}
          disabled={!file || isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            <FileText className="mr-2" size={20} />
          )}
          {isLoading ? 'Translating...' : 'Translate to French'}
        </button>
      </div>

      {translatedFile && (
        <div className="mt-4">
          <button
            onClick={handleDownload}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 flex items-center justify-center"
          >
            <Upload className="mr-2" size={20} />
            Download French Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeTranslator;
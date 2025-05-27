import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001';

interface Document {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  type: string;
}

const DocumentTest: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<any>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching documents from:', `${API_BASE_URL}/api/documents`);
      const response = await fetch(`${API_BASE_URL}/api/documents`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTestRoute = async () => {
    try {
      console.log('Fetching test route:', `${API_BASE_URL}/api/documents/test`);
      const response = await fetch(`${API_BASE_URL}/api/documents/test`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Test route response:', data);
      setTestResponse(data);
    } catch (error) {
      console.error('Test route error:', error);
      setTestResponse({ 
        error: error instanceof Error ? error.message : 'Failed to fetch test route' 
      });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Document Test Component</h1>
      
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={fetchDocuments}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fetch Documents
        </button>
        
        <button 
          onClick={fetchTestRoute}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Route
        </button>
      </div>
      
      {loading && <p className="text-gray-600">Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Documents from API:</h2>
        {documents.length === 0 ? (
          <p className="text-gray-600">No documents found.</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border p-4 rounded shadow-sm">
                <h3 className="font-bold">{doc.name}</h3>
                <p className="text-sm text-gray-600">ID: {doc.id}</p>
                <p className="text-sm text-gray-600">Type: {doc.type}</p>
                <p className="text-sm text-gray-600">Size: {doc.size} bytes</p>
                <p className="text-sm text-gray-600">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {testResponse && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Test Route Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(testResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DocumentTest;
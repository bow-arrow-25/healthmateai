import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FileText, Upload, Camera, Plus } from 'lucide-react';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get('/api/prescriptions');
      setPrescriptions(res.data.prescriptions || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('prescription', selectedFile);

    try {
      const res = await axios.post('/api/prescriptions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Prescription uploaded and processed!');
      setSelectedFile(null);
      fetchPrescriptions();
    } catch (error) {
      toast.error('Error uploading prescription');
    } finally {
      setUploading(false);
    }
  };

  const addMedicinesToList = async (prescriptionId) => {
    try {
      const res = await axios.post(`/api/prescriptions/${prescriptionId}/add-medicines`);
      toast.success(res.data.message || 'All medicines added to your list!');
      if (res.data.addedAt) {
        const addedTime = new Date(res.data.addedAt);
        toast.success(`Added at ${addedTime.toLocaleTimeString()}`, { duration: 3000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding medicines');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Prescriptions</h1>
            <p className="text-xl text-gray-600">Upload and manage your medical prescriptions</p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Camera className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Upload Prescription</h2>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Upload a photo of your prescription. Our AI will extract medicine details automatically.
              </p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="prescription-upload"
              />
              <label
                htmlFor="prescription-upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition"
              >
                Choose File
              </label>
              
              {selectedFile && (
                <div className="mt-4">
                  <p className="text-gray-700 mb-4">Selected: {selectedFile.name}</p>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {uploading ? 'Processing...' : 'Upload & Process'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="space-y-6">
            {prescriptions.map((prescription, index) => (
              <motion.div
                key={prescription._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {prescription.doctorName || 'Prescription'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(prescription.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => addMedicinesToList(prescription._id)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Medicines
                  </button>
                </div>

                {prescription.medicines && prescription.medicines.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Medicines:</h4>
                    {prescription.medicines[0]?.name === 'Unable to extract' ? (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 font-medium mb-2">⚠️ Unable to extract medicines automatically</p>
                        <p className="text-sm text-yellow-700 mb-3">
                          The OCR couldn't identify medicines from this prescription. Please add them manually to your medicine list.
                        </p>
                        <button
                          onClick={() => window.location.href = '/medicines'}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
                        >
                          Add Medicines Manually
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {prescription.medicines.map((med, idx) => (
                          <div key={idx} className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                            <p className="font-medium text-gray-900">{med.name}</p>
                            <p className="text-sm text-gray-600">{med.dosage}</p>
                            <p className="text-xs text-gray-500 mt-1">{med.frequency} • {med.duration}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {prescription.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={prescription.imageUrl}
                      alt="Prescription"
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {prescriptions.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No prescriptions yet</h3>
              <p className="text-gray-600">Upload your first prescription to get started</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Prescriptions;

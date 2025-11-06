import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Pill, Plus, Clock, Bell, Trash2, Edit2, Package, X } from 'lucide-react';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [medicineSuggestions, setMedicineSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [editingFrequency, setEditingFrequency] = useState(null);
  const [editingTimings, setEditingTimings] = useState(null);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [tempTimings, setTempTimings] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    quantity: '',
    quantityUnit: 'tablets',
    frequency: 'once_daily',
    timings: ['08:00'],
    reminderEnabled: true
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get('/api/medicines');
      setMedicines(res.data.medicines || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchMedicineSuggestions = async (query) => {
    if (query.length < 2) {
      setMedicineSuggestions([]);
      return;
    }
    try {
      const res = await api.get(`/api/medicines/suggestions?query=${query}`);
      setMedicineSuggestions(res.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleMedicineNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, name: value });
    setShowSuggestions(true);
    fetchMedicineSuggestions(value);
  };

  const selectMedicine = (medicine) => {
    setFormData({
      ...formData,
      name: medicine.name,
      dosage: medicine.dosage || formData.dosage
    });
    setShowSuggestions(false);
    setMedicineSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/medicines', formData);
      setShowAddForm(false);
      setFormData({
        name: '',
        dosage: '',
        quantity: '',
        quantityUnit: 'tablets',
        frequency: 'once_daily',
        timings: ['08:00'],
        reminderEnabled: true
      });
      fetchMedicines();
    } catch (error) {
      toast.error('Error adding medicine');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this medicine?')) {
      try {
        await api.delete(`/api/medicines/${id}`);
        fetchMedicines();
      } catch (error) {
        toast.error('Error removing medicine');
      }
    }
  };

  const handleQuantityUpdate = async (medicineId, newQuantity, unit) => {
    try {
      await api.put(`/api/medicines/${medicineId}`, {
        quantity: parseInt(newQuantity),
        quantityUnit: unit
      });
      fetchMedicines();
      setEditingQuantity(null);
    } catch (error) {
      toast.error('Error updating quantity');
    }
  };

  const handleFrequencyUpdate = async (medicineId, newFrequency) => {
    try {
      await api.put(`/api/medicines/${medicineId}`, {
        frequency: newFrequency
      });
      fetchMedicines();
      setEditingFrequency(null);
    } catch (error) {
      toast.error('Error updating frequency');
    }
  };

  const handleTimingsUpdate = async (medicineId, newTimings) => {
    try {
      await api.put(`/api/medicines/${medicineId}`, {
        timings: newTimings
      });
      fetchMedicines();
      setEditingTimings(null);
      setShowTimePickerModal(false);
    } catch (error) {
      toast.error('Error updating timings');
    }
  };

  const openTimePicker = (medicine) => {
    setSelectedMedicine(medicine);
    setTempTimings(medicine.timings && medicine.timings.length > 0 ? [...medicine.timings] : ['08:00']);
    setShowTimePickerModal(true);
  };

  const addNewTiming = () => {
    setTempTimings([...tempTimings, '12:00']);
  };

  const updateTempTiming = (index, value) => {
    const newTimings = [...tempTimings];
    newTimings[index] = value;
    setTempTimings(newTimings);
  };

  const removeTempTiming = (index) => {
    setTempTimings(tempTimings.filter((_, i) => i !== index));
  };

  const saveTimings = () => {
    if (selectedMedicine) {
      handleTimingsUpdate(selectedMedicine._id, tempTimings.filter(t => t));
    }
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const addTiming = () => {
    setFormData({ ...formData, timings: [...formData.timings, '12:00'] });
  };

  const updateTiming = (index, value) => {
    const newTimings = [...formData.timings];
    newTimings[index] = value;
    setFormData({ ...formData, timings: newTimings });
  };

  const removeTiming = (index) => {
    const newTimings = formData.timings.filter((_, i) => i !== index);
    setFormData({ ...formData, timings: newTimings });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Medicines</h1>
              <p className="text-xl text-gray-600">Manage your medications and reminders</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Medicine
            </button>
          </div>

          {/* Add Medicine Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Medicine</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleMedicineNameChange}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Start typing medicine name..."
                    />
                    {/* Autocomplete Suggestions */}
                    {showSuggestions && medicineSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto"
                      >
                        {medicineSuggestions.map((medicine, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectMedicine(medicine)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-gray-100 last:border-0"
                          >
                            <div className="font-medium text-gray-900">{medicine.name}</div>
                            {medicine.dosage && (
                              <div className="text-sm text-gray-600">{medicine.dosage} - {medicine.type}</div>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 500mg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 30"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={formData.quantityUnit}
                      onChange={(e) => setFormData({ ...formData, quantityUnit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="tablets">Tablets</option>
                      <option value="capsules">Capsules</option>
                      <option value="ml">ml</option>
                      <option value="mg">mg</option>
                      <option value="pieces">Pieces</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency / When to Take
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <optgroup label="Time of Day">
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                    </optgroup>
                    <optgroup label="With Meals">
                      <option value="before_breakfast">Before Breakfast</option>
                      <option value="after_breakfast">After Breakfast</option>
                      <option value="before_lunch">Before Lunch</option>
                      <option value="after_lunch">After Lunch</option>
                      <option value="before_dinner">Before Dinner</option>
                      <option value="after_dinner">After Dinner</option>
                    </optgroup>
                    <optgroup label="General">
                      <option value="once_daily">Once Daily</option>
                      <option value="twice_daily">Twice Daily</option>
                      <option value="thrice_daily">Thrice Daily</option>
                      <option value="as_needed">As Needed</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Times
                  </label>
                  {formData.timings.map((timing, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="time"
                        value={timing}
                        onChange={(e) => updateTiming(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.timings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTiming(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTiming}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    + Add Another Time
                  </button>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reminderEnabled"
                    checked={formData.reminderEnabled}
                    onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="reminderEnabled" className="ml-3 text-gray-700">
                    Enable reminders for this medicine
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Add Medicine
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Medicines List - Table View */}
          {medicines.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">Medicine</th>
                      <th className="hidden sm:table-cell px-4 md:px-6 py-4 text-left text-sm font-semibold">Dosage</th>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">Quantity</th>
                      <th className="hidden lg:table-cell px-4 md:px-6 py-4 text-left text-sm font-semibold">Frequency</th>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">Timings</th>
                      <th className="hidden xl:table-cell px-4 md:px-6 py-4 text-left text-sm font-semibold">Added On</th>
                      <th className="hidden md:table-cell px-4 md:px-6 py-4 text-left text-sm font-semibold">Reminders</th>
                      <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {medicines.map((medicine, index) => (
                      <motion.tr
                        key={medicine._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                              <Pill className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{medicine.name}</div>
                              <div className="sm:hidden text-xs text-gray-500">{medicine.dosage}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 md:px-6 py-4">
                          <span className="text-gray-700">{medicine.dosage || '-'}</span>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          {editingQuantity === medicine._id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                defaultValue={medicine.quantity || 0}
                                min="0"
                                className="w-20 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onBlur={(e) => handleQuantityUpdate(medicine._id, e.target.value, medicine.quantityUnit)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleQuantityUpdate(medicine._id, e.target.value, medicine.quantityUnit);
                                  }
                                }}
                                autoFocus
                              />
                              <select
                                defaultValue={medicine.quantityUnit || 'tablets'}
                                className="px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                onChange={(e) => handleQuantityUpdate(medicine._id, medicine.quantity, e.target.value)}
                              >
                                <option value="tablets">tablets</option>
                                <option value="capsules">capsules</option>
                                <option value="ml">ml</option>
                                <option value="mg">mg</option>
                                <option value="pieces">pieces</option>
                              </select>
                            </div>
                          ) : (
                            <div 
                              className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                              onClick={() => setEditingQuantity(medicine._id)}
                              title="Click to edit quantity"
                            >
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">
                                {medicine.quantity || 0} {medicine.quantityUnit || 'tablets'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="hidden lg:table-cell px-4 md:px-6 py-4">
                          {editingFrequency === medicine._id ? (
                            <select
                              defaultValue={medicine.frequency}
                              className="px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                              onChange={(e) => handleFrequencyUpdate(medicine._id, e.target.value)}
                              onBlur={() => setEditingFrequency(null)}
                              autoFocus
                            >
                              <option value="morning">Morning</option>
                              <option value="afternoon">Afternoon</option>
                              <option value="evening">Evening</option>
                              <option value="night">Night</option>
                              <option value="before_breakfast">Before Breakfast</option>
                              <option value="after_breakfast">After Breakfast</option>
                              <option value="before_lunch">Before Lunch</option>
                              <option value="after_lunch">After Lunch</option>
                              <option value="before_dinner">Before Dinner</option>
                              <option value="after_dinner">After Dinner</option>
                              <option value="once_daily">Once Daily</option>
                              <option value="twice_daily">Twice Daily</option>
                              <option value="thrice_daily">Thrice Daily</option>
                              <option value="as_needed">As Needed</option>
                            </select>
                          ) : (
                            <div 
                              className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                              onClick={() => setEditingFrequency(medicine._id)}
                              title="Click to edit frequency"
                            >
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 capitalize">
                                {medicine.frequency.replace(/_/g, ' ')}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div 
                            className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            onClick={() => openTimePicker(medicine)}
                            title="Click to set reminder times"
                          >
                            <Bell className="w-4 h-4 text-blue-500" />
                            <div className="flex flex-col">
                              {medicine.timings && medicine.timings.length > 0 ? (
                                medicine.timings.map((time, idx) => (
                                  <span key={idx} className="text-gray-700 text-sm">
                                    {time}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-sm">Click to set</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="hidden xl:table-cell px-4 md:px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {formatDateTime(medicine.createdAt)}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-4">
                          {medicine.reminderEnabled ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Enabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Disabled
                            </span>
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleDelete(medicine._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete medicine"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Summary Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Total Medicines: <span className="font-semibold text-gray-900">{medicines.length}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Active Reminders: <span className="font-semibold text-gray-900">
                      {medicines.filter(m => m.reminderEnabled).length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Time Picker Modal */}
          {showTimePickerModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Set Reminder Times</h3>
                      <p className="text-sm text-gray-600">{selectedMedicine?.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTimePickerModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tempTimings.map((timing, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <input
                        type="time"
                        value={timing}
                        onChange={(e) => updateTempTiming(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                      {tempTimings.length > 1 && (
                        <button
                          onClick={() => removeTempTiming(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={addNewTiming}
                  className="w-full mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium text-sm"
                >
                  + Add Another Time
                </button>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowTimePickerModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveTimings}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                  >
                    Save Times
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {medicines.length === 0 && !showAddForm && (
            <div className="text-center py-16">
              <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No medicines added yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your medications by adding your first medicine</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Medicine
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Medicines;

import React, { useState } from 'react';

export default function FilterPopup({ advancedFilters, setAdvancedFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...advancedFilters });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setAdvancedFilters({ ...localFilters });
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = { firstName: '', lastName: '', email: '', department: '' };
    setLocalFilters(cleared);
    setAdvancedFilters(cleared);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 shadow-xs transition-colors cursor-pointer"
      >
        Advanced Filter
      </button>

      {isOpen && (
        <>
          {/* Backdrop layer to click outside and close */}
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          
          <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-30 p-4 animate-in fade-in zoom-in-95 duration-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter Options</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={localFilters.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={localFilters.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input 
                  type="text" 
                  name="email"
                  value={localFilters.email}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
                <select 
                  name="department"
                  value={localFilters.department}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
              <button onClick={handleClear} className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer">Clear</button>
              <button onClick={handleApply} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Apply</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
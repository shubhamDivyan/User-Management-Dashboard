import React, { useState, useEffect, useMemo } from 'react';
import FilterPopup from './components/FilterPopup';
import UserModal from './components/UserModal';

const API_URL = 'https://jsonplaceholder.typicode.com/users';
const MOCK_DEPTS = ['Engineering', 'Marketing', 'Sales', 'HR'];

export default function App() {
  // App Core States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Search, Sort & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('id-asc');
  const [advancedFilters, setAdvancedFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal Control States
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch initial users from Mock Backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to retrieve user directories.');
        const data = await res.json();

        // Mapping fields to meet requirements + adding Mock Department
        const mappedUsers = data.map((user, idx) => {
          const nameParts = user.name.split(' ');
          return {
            id: user.id,
            firstName: nameParts[0] || 'John',
            lastName: nameParts.slice(1).join(' ') || 'Doe',
            email: user.email.toLowerCase(),
            department: MOCK_DEPTS[idx % MOCK_DEPTS.length]
          };
        });
        setUsers(mappedUsers);
      } catch (err) {
        setError(err.message || 'An error occurred while communicating with the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // System Feedback Alert Handler
  const triggerToast = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  // --- Core Memoized Pipeline: Filter -> Search -> Sort ---
  const processedUsers = useMemo(() => {
    let result = [...users];

    // 1. Apply Advanced Filters
    const { firstName, lastName, email, department } = advancedFilters;
    if (firstName) result = result.filter(u => u.firstName.toLowerCase().includes(firstName.toLowerCase()));
    if (lastName) result = result.filter(u => u.lastName.toLowerCase().includes(lastName.toLowerCase()));
    if (email) result = result.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
    if (department) result = result.filter(u => u.department === department);

    // 2. Apply Main Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(u => 
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }

    // 3. Apply Sorting
    if (sortBy === 'id-asc') result.sort((a, b) => a.id - b.id);
    if (sortBy === 'id-desc') result.sort((a, b) => b.id - a.id);
    if (sortBy === 'name-asc') result.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    if (sortBy === 'name-desc') result.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));

    return result;
  }, [users, searchQuery, sortBy, advancedFilters]);

  // Handle Dynamic Pagination Bounds
  const totalItems = processedUsers.length;
  const maxPage = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = currentPage > maxPage ? maxPage : currentPage;

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return processedUsers.slice(start, start + itemsPerPage);
  }, [processedUsers, safeCurrentPage, itemsPerPage]);

  // --- CRUD API Event Handlers ---
  const handleAddUser = async (formData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      });
      if (!res.ok) throw new Error('Could not sync new entry to mock backend.');
      
      // Creating dynamic client-side ID for simulation safety
      const clientSideId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers(prev => [{ id: clientSideId, ...formData }, ...prev]);
      triggerToast('User added successfully (API Simulation complete).');
      setModalMode(null);
    } catch (err) {
      triggerToast(err.message, true);
    }
  };

  const handleEditUser = async (formData) => {
    const targetId = selectedUser.id;
    try {
      // JSONPlaceholder has max 10 indices, fallback safe check for simulated values (>10)
      const mockFetchId = targetId > 10 ? 1 : targetId;
      const res = await fetch(`${API_URL}/${mockFetchId}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      });
      if (!res.ok) throw new Error('Failed to save parameters to endpoint tree.');

      setUsers(prev => prev.map(u => u.id === targetId ? { id: targetId, ...formData } : u));
      triggerToast('User parameters modified successfully.');
      setModalMode(null);
    } catch (err) {
      triggerToast(err.message, true);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you certain you want to destroy this user entry?')) return;
    try {
      const mockFetchId = id > 10 ? 1 : id;
      const res = await fetch(`${API_URL}/${mockFetchId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Server cluster rejected execution packet pipeline stream.');

      setUsers(prev => prev.filter(u => u.id !== id));
      triggerToast('Database state profile removal validation complete.');
    } catch (err) {
      triggerToast(err.message, true);
    }
  };

  const getDeptColor = (dept) => {
    switch (dept) {
      case 'Engineering': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Marketing': return 'bg-pink-50 text-pink-700 border border-pink-200';
      case 'Sales': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'HR': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">User Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your team members, departments, and roles.</p>
          </div>
          <button 
            onClick={() => { setSelectedUser(null); setModalMode('add'); }}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-xs transition-colors cursor-pointer self-start md:self-auto"
          >
            + Add New User
          </button>
        </header>

        {/* Dynamic Alerts System Box */}
        {successMsg && (
          <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200 flex justify-between items-center shadow-xs">
            <span className="text-sm font-medium">{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="text-green-600 hover:text-green-900 cursor-pointer">✕</button>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200 flex justify-between items-center shadow-xs">
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-900 cursor-pointer">✕</button>
          </div>
        )}

        {/* Global Control Filter Bars */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[240px] md:w-80">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by name, email or dept..." 
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* Advanced Filter Component Popup */}
            <FilterPopup advancedFilters={advancedFilters} setAdvancedFilters={(filters) => { setAdvancedFilters(filters); setCurrentPage(1); }} />
          </div>

          {/* Sorter and Pagination Limits */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-500 whitespace-nowrap">Sort By:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="id-asc">ID (Low to High)</option>
                <option value="id-desc">ID (High to Low)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-500 whitespace-nowrap">Show:</label>
              <select 
                value={itemsPerPage} 
                onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data View Grid Table */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4 w-16">ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  // Skeleton Rows Shimmer Animation State
                  [...Array(5)].map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded-sm animate-pulse w-4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded-sm animate-pulse w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded-sm animate-pulse w-48"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded-sm animate-pulse w-20"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 rounded-sm animate-pulse w-24 inline-block"></div></td>
                    </tr>
                  ))
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-500">{user.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeptColor(user.department)}`}>
                          {user.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => { setSelectedUser(user); setModalMode('edit'); }}
                          className="text-blue-600 hover:text-blue-900 font-medium text-xs border border-blue-200 bg-blue-50 px-2.5 py-1.5 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 font-medium text-xs border border-red-200 bg-red-50 px-2.5 py-1.5 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Empty State Layout */}
          {!loading && totalItems === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3 text-lg font-bold">✕</div>
              <h3 className="text-base font-semibold text-gray-900">No users found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">Try adjusting your search terms or filter constraints.</p>
            </div>
          )}

          {/* Pagination Navigation Footer */}
          {!loading && totalItems > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Showing {totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1} to {Math.min(safeCurrentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={safeCurrentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs cursor-pointer"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, maxPage))}
                  disabled={safeCurrentPage === maxPage}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Manager Form Portal */}
        {modalMode && (
          <UserModal 
            mode={modalMode} 
            user={selectedUser} 
            onClose={() => setModalMode(null)} 
            onSave={modalMode === 'add' ? handleAddUser : handleEditUser} 
          />
        )}

      </div>
    </div>
  );
}
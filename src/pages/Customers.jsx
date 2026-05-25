import React, { useEffect, useState } from 'react';
import {
  listCustomers, createCustomer, updateCustomer, deleteCustomer
} from '../api/customersApi';

export default function Customers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await listCustomers();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await createCustomer(form);
      setForm({ name: '', email: '', phone: '' });
      setSuccess('Customer created successfully!');
      setShowForm(false);
      await fetchList();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Create failed');
    }
  };

  const startEdit = (c) => {
    setEditing(c.id);
    setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '' });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await updateCustomer(editing, form);
      setEditing(null);
      setForm({ name: '', email: '', phone: '' });
      setSuccess('Customer updated successfully!');
      setShowForm(false);
      await fetchList();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      setSuccess('Customer deleted successfully!');
      await fetchList();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Delete failed');
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', email: '', phone: '' });
  };

  const filteredList = list.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Customers
          </h1>
          <p className="text-sm text-slate-500">Manage your customer database</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', email: '', phone: '' }); }}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 animate-scale-in" style={{
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399'
        }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          {success}
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 animate-scale-in" style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171'
        }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* Search */}
      <div className="glass-card rounded-xl p-3 animate-slide-up stagger-2">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search customers by name, email, or phone..."
            className="input-field w-full pl-10 pr-4 py-2.5 rounded-lg text-sm" />
          {searchTerm && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">
              {filteredList.length} found
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden animate-slide-up stagger-3">
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <div className="relative w-10 h-10">
              <div className="w-10 h-10 rounded-full border-2 border-slate-800" />
              <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent" style={{ animation: 'spin 0.8s linear infinite' }} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((c, idx) => (
                  <tr key={c.id || c._id} className={`table-row animate-row-in row-stagger-${Math.min(idx + 1, 5)}`}
                    style={{ borderBottom: '1px solid rgba(148,163,184,0.04)' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold" style={{
                          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(34,211,238,0.1))',
                          border: '1px solid rgba(59,130,246,0.2)',
                          color: '#60a5fa'
                        }}>
                          {c.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-medium text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{c.email}</td>
                    <td className="p-4 text-sm text-slate-400 font-mono">{c.phone}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(c)}
                          className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="Edit">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(c.id || c._id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-16 text-center">
                      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{
                        background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)'
                      }}>
                        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium text-slate-500 mb-1">
                        {searchTerm ? 'No customers found' : 'No customers yet'}
                      </div>
                      <div className="text-xs text-slate-600">
                        {searchTerm ? 'Try a different search term' : 'Click "Add Customer" to get started'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="glass-card rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-500 animate-slide-up stagger-4">
        <span>Total: <strong className="text-slate-300">{list.length}</strong> customers</span>
        <span>Showing: <strong className="text-slate-300">{filteredList.length}</strong></span>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card w-full max-w-lg p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                  background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)'
                }}>
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={editing ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"} />
                  </svg>
                </div>
                {editing ? 'Edit Customer' : 'New Customer'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={editing ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required
                  className="input-field w-full p-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" type="email" required
                  className="input-field w-full p-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required
                  className="input-field w-full p-3 rounded-xl text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 btn-primary px-4 py-3 rounded-xl text-sm font-bold">
                  {editing ? 'Save Changes' : 'Create Customer'}
                </button>
                <button type="button" onClick={closeModal}
                  className="btn-secondary px-6 py-3 rounded-xl text-sm font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

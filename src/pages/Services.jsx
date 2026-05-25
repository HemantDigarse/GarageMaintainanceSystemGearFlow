import React, { useEffect, useState } from 'react';
import { listServices, createService, updateService, deleteService } from '../api/servicesApi';

export default function Services() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try { const data = await listServices(); setList(Array.isArray(data) ? data : []); }
    catch { setError('Failed to load services'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const create = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await createService(form);
      setForm({ name: '', description: '', price: '' });
      setSuccess('Service created!'); setShowForm(false); await fetch();
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Create failed'); }
  };

  const startEdit = (s) => {
    setEditing(s.id);
    setForm({ name: s.name || '', description: s.description || '', price: s.price || '' });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await updateService(editing, form);
      setEditing(null); setForm({ name: '', description: '', price: '' });
      setSuccess('Service updated!'); setShowForm(false); await fetch();
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Update failed'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(id); setSuccess('Service deleted!'); await fetch();
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Delete failed'); }
  };

  const filteredList = list.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="glass rounded-xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Services</h1>
          <p className="text-sm text-slate-400">Manage your service offerings</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', price: '' }); }}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2 animate-scale-in">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2 animate-scale-in">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="glass rounded-xl p-6 animate-slide-down">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {editing ? 'Edit Service' : 'New Service'}
          </h2>
          <form onSubmit={editing ? save : create} className="grid gap-3 grid-cols-1 md:grid-cols-4">
            <input name="name" value={form.name} onChange={change} placeholder="Service Name" required className="input-field p-3 rounded-xl text-sm" />
            <input name="description" value={form.description} onChange={change} placeholder="Description" required className="input-field p-3 rounded-xl text-sm" />
            <input name="price" value={form.price} onChange={change} placeholder="Price" type="number" step="0.01" required className="input-field p-3 rounded-xl text-sm" />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary px-4 py-3 rounded-xl text-sm font-semibold">{editing ? 'Save' : 'Create'}</button>
              <button type="button"
                onClick={() => { setShowForm(false); setEditing(null); setForm({ name: '', description: '', price: '' }); }}
                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="glass rounded-xl p-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search services..." className="input-field w-full pl-10 pr-4 py-2.5 rounded-lg text-sm" />
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <svg className="animate-spin w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredList.map(s => (
                  <tr key={s.id || s._id} className="table-row">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400 max-w-xs truncate">{s.description}</td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-emerald-400">₹{Number(s.price).toFixed(2)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => startEdit(s)} className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => remove(s.id || s._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
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
                    <td colSpan="4" className="p-12 text-center">
                      <svg className="w-12 h-12 text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                      <div className="text-sm text-slate-500">{searchTerm ? 'No services found' : 'No services yet'}</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="glass rounded-xl p-3 flex items-center justify-between text-xs text-slate-500">
        <span>Total: <strong className="text-slate-300">{list.length}</strong></span>
        <span>Showing: <strong className="text-slate-300">{filteredList.length}</strong></span>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { listVehicles, createVehicle, updateVehicle, deleteVehicle } from "../api/vehiclesApi";
import { listCustomers } from "../api/customersApi";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ plateNumber: "", brand: "", model: "", fuelType: "", customerId: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadVehicles = async () => {
    try { const data = await listVehicles(); setVehicles(data); setError(""); }
    catch { setError("Failed to load vehicles"); }
  };

  const loadCustomers = async () => {
    try { const data = await listCustomers(); setCustomers(Array.isArray(data) ? data : []); }
    catch (err) { console.error("Failed to load customers", err); }
  };

  useEffect(() => { loadVehicles(); loadCustomers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerId) { setError("Customer ID is required"); return; }
    try {
      if (editingId) {
        await updateVehicle(editingId, form);
        setSuccess("Vehicle updated successfully!");
      } else {
        await createVehicle(form);
        setSuccess("Vehicle created successfully!");
      }
      setForm({ plateNumber: "", brand: "", model: "", fuelType: "", customerId: "" });
      setEditingId(null); setShowForm(false); loadVehicles(); setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch { setError("Create/Update failed"); }
  };

  const handleEdit = (vehicle) => { setEditingId(vehicle.id); setForm(vehicle); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await deleteVehicle(id); setSuccess("Vehicle deleted!"); loadVehicles();
      setTimeout(() => setSuccess(""), 3000);
    } catch { setError("Delete failed"); }
  };

  const filteredVehicles = vehicles.filter(v =>
    v.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fuelColors = {
    'Petrol': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Diesel': 'text-slate-300 bg-slate-500/10 border-slate-500/20',
    'Electric': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'Hybrid': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'CNG': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    'LPG': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="glass rounded-xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Vehicles</h1>
          <p className="text-sm text-slate-400">Manage your vehicle fleet</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ plateNumber: "", brand: "", model: "", fuelType: "", customerId: "" }); }}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Vehicle
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
              <path strokeLinecap="round" strokeLinejoin="round" d={editingId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
            </svg>
            {editingId ? 'Edit Vehicle' : 'New Vehicle'}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-3 grid-cols-1 md:grid-cols-6">
            <input name="plateNumber" placeholder="Plate Number" value={form.plateNumber} onChange={handleChange} required className="input-field p-3 rounded-xl text-sm" />
            <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required className="input-field p-3 rounded-xl text-sm" />
            <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required className="input-field p-3 rounded-xl text-sm" />
            <select name="fuelType" value={form.fuelType} onChange={handleChange} required className="input-field p-3 rounded-xl text-sm">
              <option value="">Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
              <option value="LPG">LPG</option>
            </select>
            <select name="customerId" value={form.customerId} onChange={handleChange} required className="input-field p-3 rounded-xl text-sm">
              <option value="">Select Owner</option>
              {customers.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary px-4 py-3 rounded-xl text-sm font-semibold">{editingId ? 'Save' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm({ plateNumber: "", brand: "", model: "", fuelType: "", customerId: "" }); }}
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
            placeholder="Search vehicles..." className="input-field w-full pl-10 pr-4 py-2.5 rounded-lg text-sm" />
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Plate No</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Model</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fuel</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <svg className="w-12 h-12 text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 5h3m5 0h2M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    <div className="text-sm text-slate-500">{searchTerm ? 'No vehicles found' : 'No vehicles yet'}</div>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map(v => {
                  const owner = customers.find(c => (c.id || c._id) == v.customerId);
                  const fuelStyle = fuelColors[v.fuelType] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                  return (
                    <tr key={v.id} className="table-row">
                      <td className="p-4 text-sm font-mono font-semibold text-white">{v.plateNumber}</td>
                      <td className="p-4 text-sm text-slate-300">{v.brand}</td>
                      <td className="p-4 text-sm text-slate-400">{v.model}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${fuelStyle}`}>
                          {v.fuelType}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{owner?.name || 'N/A'}</td>
                      <td className="p-4">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleEdit(v)} className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(v.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="glass rounded-xl p-3 flex items-center justify-between text-xs text-slate-500">
        <span>Total: <strong className="text-slate-300">{vehicles.length}</strong></span>
        <span>Showing: <strong className="text-slate-300">{filteredVehicles.length}</strong></span>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { listInvoices, createInvoice, updateInvoice, deleteInvoice } from '../api/invoicesApi';
import { listCustomers } from '../api/customersApi';
import { listVehicles } from '../api/vehiclesApi';
import { listServices } from '../api/servicesApi';
import { createPayment } from '../api/paymentsApi';

export default function Invoices() {
  const [list, setList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [form, setForm] = useState({ customerId: '', vehicleId: '', status: 'pending' });
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invoiceData, customerData, vehicleData, serviceData] = await Promise.all([
        listInvoices(), listCustomers(), listVehicles(), listServices()
      ]);
      setList(Array.isArray(invoiceData) ? invoiceData : []);
      setCustomers(Array.isArray(customerData) ? customerData : []);
      setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addService = (serviceId) => {
    if (!serviceId || selectedServices.some(s => s.id === serviceId)) return;
    const service = services.find(s => (s.id || s._id) == serviceId);
    if (service) {
      setSelectedServices([...selectedServices, { id: service.id || service._id, name: service.name, price: service.price }]);
    }
  };

  const removeService = (serviceId) => setSelectedServices(selectedServices.filter(s => s.id !== serviceId));

  const create = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.customerId || !form.vehicleId || selectedServices.length === 0) {
      setError('Please select customer, vehicle, and at least one service'); return;
    }
    try {
      const invoiceData = {
        customerId: form.customerId, vehicleId: form.vehicleId,
        services: selectedServices.map(s => s.name).join(', '),
        status: form.status,
        totalAmount: selectedServices.reduce((sum, s) => sum + (s.price || 0), 0),
        invoiceDate: new Date().toISOString().split('T')[0]
      };
      await createInvoice(invoiceData);
      setForm({ customerId: '', vehicleId: '', status: 'pending' });
      setSelectedServices([]); setSuccess('Invoice created!'); setShowForm(false);
      await fetchData(); setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Create failed'); }
  };

  const startEdit = (invoice) => {
    setEditing(invoice.id || invoice._id);
    setForm({ customerId: invoice.customerId || '', vehicleId: invoice.vehicleId || '', status: invoice.status || 'pending' });
    if (invoice.services && typeof invoice.services === 'string') {
      const serviceNames = invoice.services.split(',').map(s => s.trim());
      const invoiceServices = serviceNames.map(name => {
        const service = services.find(s => s.name === name);
        return service ? { id: service.id || service._id, name: service.name, price: service.price } : null;
      }).filter(Boolean);
      setSelectedServices(invoiceServices);
    } else { setSelectedServices([]); }
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.customerId || !form.vehicleId || selectedServices.length === 0) {
      setError('Please select customer, vehicle, and at least one service'); return;
    }
    try {
      const invoiceData = {
        customerId: form.customerId, vehicleId: form.vehicleId,
        services: selectedServices.map(s => s.name).join(', '),
        status: form.status,
        totalAmount: selectedServices.reduce((sum, s) => sum + (s.price || 0), 0),
        invoiceDate: new Date().toISOString().split('T')[0]
      };
      await updateInvoice(editing, invoiceData);
      setEditing(null); setForm({ customerId: '', vehicleId: '', status: 'pending' });
      setSelectedServices([]); setSuccess('Invoice updated!'); setShowForm(false);
      await fetchData(); setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Update failed'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    try { await deleteInvoice(id); setSuccess('Invoice deleted!'); await fetchData(); setTimeout(() => setSuccess(''), 3000); }
    catch { setError('Delete failed'); }
  };

  const processPayment = async () => {
    if (!payingInvoice) return; setError(''); setSuccess('');
    try {
      await createPayment({
        invoiceId: payingInvoice.id || payingInvoice._id,
        amount: payingInvoice.totalAmount, method: paymentMethod,
        paymentDate: new Date().toISOString().split('T')[0]
      });
      await updateInvoice(payingInvoice.id || payingInvoice._id, { status: 'completed' });
      setPayingInvoice(null); setSuccess('Payment recorded!');
      await fetchData(); setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Payment failed'); }
  };

  const filteredList = list.filter(inv => {
    const customer = customers.find(c => (c.id || c._id) == inv.customerId);
    const vehicle = vehicles.find(v => (v.id || v._id) == inv.vehicleId);
    const searchLower = searchTerm.toLowerCase();
    return customer?.name?.toLowerCase().includes(searchLower) ||
      vehicle?.plateNumber?.toLowerCase().includes(searchLower) ||
      (inv.id || inv._id)?.toString().includes(searchLower);
  });

  const filteredVehicles = vehicles.filter(v => !form.customerId || v.customerId == form.customerId);
  const totalServices = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);

  const statusStyles = {
    'completed': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'pending': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'cancelled': 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const stats = [
    { label: 'Total Invoices', value: list.length, color: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/15', textColor: 'text-blue-300' },
    { label: 'Pending', value: list.filter(i => i.status === 'pending').length, color: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-500/15', textColor: 'text-amber-300' },
    { label: 'Paid', value: list.filter(i => i.status === 'completed').length, color: 'from-emerald-500/10 to-green-500/10', border: 'border-emerald-500/15', textColor: 'text-emerald-300' },
    { label: 'Revenue', value: `₹${list.filter(i => i.status === 'completed').reduce((sum, i) => sum + (i.totalAmount || 0), 0).toFixed(0)}`, color: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-500/15', textColor: 'text-violet-300' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="glass rounded-xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Payments</h1>
          <p className="text-sm text-slate-400">Create invoices and process payments</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ customerId: '', vehicleId: '', status: 'pending' }); setSelectedServices([]); }}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className={`glass rounded-xl p-4 bg-gradient-to-br ${s.color} border ${s.border}`}>
            <div className="text-xs text-slate-500 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.textColor}`}>{s.value}</div>
          </div>
        ))}
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
          <h2 className="text-base font-bold text-white mb-4">{editing ? 'Edit Invoice' : 'Create Invoice'}</h2>
          <form onSubmit={editing ? save : create} className="space-y-4">
            <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
              <select name="customerId" value={form.customerId} onChange={change} required className="input-field p-3 rounded-xl text-sm">
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
              </select>
              <select name="vehicleId" value={form.vehicleId} onChange={change} required disabled={!form.customerId} className="input-field p-3 rounded-xl text-sm disabled:opacity-40">
                <option value="">Select Vehicle</option>
                {filteredVehicles.map(v => <option key={v.id || v._id} value={v.id || v._id}>{v.plateNumber} - {v.brand} {v.model}</option>)}
              </select>
              <select name="status" value={form.status} onChange={change} className="input-field p-3 rounded-xl text-sm">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Service Selection */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">Add Services</h3>
              <div className="flex gap-2 mb-3">
                <select id="serviceSelect" className="input-field flex-1 p-3 rounded-xl text-sm">
                  <option value="">Select a service...</option>
                  {services.filter(s => !selectedServices.some(sel => sel.id === (s.id || s._id))).map(s => (
                    <option key={s.id || s._id} value={s.id || s._id}>{s.name} - ₹{Number(s.price).toFixed(2)}</option>
                  ))}
                </select>
                <button type="button"
                  onClick={() => { const select = document.getElementById('serviceSelect'); addService(select.value); select.value = ''; }}
                  className="btn-primary px-5 rounded-xl text-sm font-semibold">Add</button>
              </div>
              {selectedServices.length > 0 ? (
                <div className="space-y-2">
                  {selectedServices.map(s => (
                    <div key={s.id} className="flex items-center justify-between glass rounded-lg p-3">
                      <div className="flex-1">
                        <span className="text-sm text-white font-medium">{s.name}</span>
                        <span className="text-sm text-emerald-400 font-bold ml-3">₹{Number(s.price).toFixed(2)}</span>
                      </div>
                      <button type="button" onClick={() => removeService(s.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-sm font-semibold text-emerald-400">Total</span>
                    <span className="text-lg font-bold text-emerald-300">₹{totalServices.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-slate-500 py-4">No services added yet</div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary px-4 py-3 rounded-xl text-sm font-semibold">
                {editing ? 'Save Changes' : 'Create Invoice'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm({ customerId: '', vehicleId: '', status: 'pending' }); setSelectedServices([]); }}
                className="px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50">
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
            placeholder="Search invoices..." className="input-field w-full pl-10 pr-4 py-2.5 rounded-lg text-sm" />
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
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Services</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredList.map(inv => {
                  const customer = customers.find(c => (c.id || c._id) == inv.customerId);
                  const vehicle = vehicles.find(v => (v.id || v._id) == inv.vehicleId);
                  const statusStyle = statusStyles[inv.status] || statusStyles.pending;
                  return (
                    <tr key={inv.id || inv._id} className="table-row">
                      <td className="p-4 text-sm text-slate-300 font-mono">{inv.invoiceDate || 'N/A'}</td>
                      <td className="p-4 text-sm text-slate-300">{customer?.name || 'N/A'}</td>
                      <td className="p-4 text-sm text-slate-400 font-mono">{vehicle?.plateNumber || 'N/A'}</td>
                      <td className="p-4 text-sm text-slate-400 max-w-[200px] truncate">{inv.services || '-'}</td>
                      <td className="p-4 text-sm font-bold text-emerald-400">₹{Number(inv.totalAmount || 0).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusStyle}`}>
                          {inv.status === 'completed' ? 'Paid' : inv.status === 'pending' ? 'Unpaid' : 'Cancelled'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1.5">
                          {inv.status === 'pending' && (
                            <button onClick={() => { setPayingInvoice(inv); setPaymentMethod('cash'); }}
                              className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Pay">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </button>
                          )}
                          <button onClick={() => startEdit(inv)}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => remove(inv.id || inv._id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <svg className="w-12 h-12 text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                      <div className="text-sm text-slate-500">{searchTerm ? 'No invoices found' : 'No invoices yet'}</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-amber-500/20 animate-scale-in">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Process Payment
            </h2>
            <div className="space-y-3 mb-6">
              <div className="glass rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-0.5">Customer</div>
                <div className="text-sm text-white font-semibold">{customers.find(c => (c.id || c._id) == payingInvoice.customerId)?.name || 'N/A'}</div>
              </div>
              <div className="glass rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-0.5">Vehicle</div>
                <div className="text-sm text-white font-medium font-mono">{vehicles.find(v => (v.id || v._id) == payingInvoice.vehicleId)?.plateNumber || 'N/A'}</div>
              </div>
              <div className="rounded-lg p-4 bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-emerald-400/70 mb-0.5">Amount</div>
                <div className="text-3xl font-bold text-emerald-300">₹{Number(payingInvoice.totalAmount || 0).toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                  className="input-field w-full p-3 rounded-xl text-sm">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={processPayment}
                className="flex-1 btn-primary px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Confirm
              </button>
              <button onClick={() => setPayingInvoice(null)}
                className="px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="glass rounded-xl p-3 flex items-center justify-between text-xs text-slate-500">
        <span>Total: <strong className="text-slate-300">{list.length}</strong></span>
        <span>Showing: <strong className="text-slate-300">{filteredList.length}</strong></span>
      </div>
    </div>
  );
}

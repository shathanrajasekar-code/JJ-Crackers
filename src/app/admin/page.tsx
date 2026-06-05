'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/store/adminStore';
import { 
  Lock, LayoutDashboard, ShoppingCart, Package, Mail, MessageCircle, 
  BarChart3, LogOut, Search, RefreshCw, Trash2, CheckCircle2, Clock, 
  Truck, XCircle, Users, DollarSign, TrendingUp, Upload, Database, 
  Zap, Gift, FileText, Download, Send, ChevronRight, X, Eye, 
  SlidersHorizontal, Calendar, MapPin, User, ArrowRight
} from 'lucide-react';
import Image from 'next/image';

// --- CUSTOM MODAL CONFIRM DIALOG ---
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ isOpen, title, message, confirmLabel, cancelLabel = 'Cancel', isDanger = false, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100]" 
            onClick={onCancel} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: '-40%' }} 
            animate={{ opacity: 1, scale: 1, y: '-50%' }} 
            exit={{ opacity: 0, scale: 0.9, y: '-40%' }} 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md bg-[#161614] border border-[#2A2A24] rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${isDanger ? 'bg-rose-500/10 text-rose-400' : 'bg-[var(--color-gold)]/10 text-[var(--color-gold)]'}`}>
                {isDanger ? <Trash2 size={24} /> : <CheckCircle2 size={24} />}
              </div>
              <h3 className="text-xl font-bold font-display text-[#F5F5F0] mb-2">{title}</h3>
              <p className="text-sm text-[#A0A090] mb-6 leading-relaxed">{message}</p>
              <div className="flex gap-3">
                <button 
                  onClick={onCancel} 
                  className="flex-1 py-3 rounded-xl border border-[#2A2A24] text-[#F5F5F0] font-bold text-sm hover:bg-[#252520] transition-colors"
                >
                  {cancelLabel}
                </button>
                <button 
                  onClick={onConfirm} 
                  className={`flex-1 py-3 rounded-xl font-bold text-sm text-[#1a1400] transition-all ${isDanger ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)]'}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- LOGIN GATE ---
function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/auth', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ password }) 
      });
      const data = await res.json();
      if (res.ok) { 
        onLogin(data.token); 
      } else { 
        setError(data.error || 'Invalid password'); 
      }
    } catch { 
      setError('Connection failed'); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A08]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-[#141412] border border-[#2A2A24] rounded-3xl p-10 text-center relative overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.05)]">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-65" />
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.25)]">
            <Lock size={32} className="text-[#1a1400]" />
          </div>
          <h1 className="text-3xl font-bold font-display text-[#F5F5F0] mb-2 tracking-tight">Admin Console</h1>
          <p className="text-[#A0A090] text-sm mb-8">Authorize to enter the command center</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter admin password" 
                required
                className="w-full bg-[#1C1C18] border border-[#2A2A24] rounded-xl px-4 py-3.5 text-center text-sm text-[#F5F5F0] placeholder-[#A0A090]/40 focus:border-[var(--color-gold)] focus:outline-none transition-colors" 
              />
            </div>
            
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-400 text-sm font-medium">
                {error}
              </motion.p>
            )}
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying Credentials...' : 'Access Command Center'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// --- STAT CARD ---
function StatCard({ icon: Icon, label, value, color, change }: { icon: any; label: string; value: string | number; color: string; change?: string }) {
  return (
    <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--color-gold)]/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
          <Icon size={20} />
        </div>
        {change && (
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold font-display text-[#F5F5F0] mb-1">{value}</div>
      <div className="text-xs text-[#A0A090] font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

// --- STATUS BADGE ---
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    shipped: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[status] || 'bg-[#2A2A24] text-[#A0A090] border-[#2A2A24]'}`}>
      {status}
    </span>
  );
}

// --- MAIN ADMIN COMMAND CENTER ---
export default function AdminPage() {
  const { isAuthenticated, login, logout, activeTab, setActiveTab, checkSession } = useAdminStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // States for search and filter
  const [orderQuery, setOrderQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  
  // Custom dialog state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    isDanger?: boolean;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    action: () => {},
  });

  // Selected Inspect Order (Flyout Panel)
  const [inspectedOrder, setInspectedOrder] = useState<any | null>(null);
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);
  
  // Excel File State
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [seedStatus, setSeedStatus] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedComboStatus, setSeedComboStatus] = useState('');
  const [seedingCombos, setSeedingCombos] = useState(false);

  useEffect(() => { 
    setMounted(true); 
    checkSession(); 
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [o, p, e, m, c, t] = await Promise.all([
        fetch('/api/orders').then(r => r.json()).catch(() => []),
        fetch('/api/products').then(r => r.json()).catch(() => ({ products: [] })),
        fetch('/api/enquiries').then(r => r.json()).catch(() => []),
        fetch('/api/contact').then(r => r.json()).catch(() => []),
        fetch('/api/combos').then(r => r.json()).catch(() => []),
        fetch('/api/admin/tracking').then(r => r.json()).catch(() => ({ error_logs: [], analytics_events: [] })),
      ]);
      setOrders(Array.isArray(o) ? o : []);
      setProducts(Array.isArray(p) ? p : (p.products || []));
      setEnquiries(Array.isArray(e) ? e : []);
      setMessages(Array.isArray(m) ? m : []);
      setCombos(Array.isArray(c) ? c : []);
      setErrorLogs(t.error_logs || []);
      setAnalyticsEvents(t.analytics_events || []);
    } catch (err) { 
      console.error(err); 
    }
    setLoading(false);
  };

  useEffect(() => { 
    if (isAuthenticated) fetchData(); 
  }, [isAuthenticated]);

  // Sync selected inspected order when list refreshes
  useEffect(() => {
    if (inspectedOrder && orders.length > 0) {
      const updated = orders.find(o => o.id === inspectedOrder.id);
      if (updated) setInspectedOrder(updated);
    }
  }, [orders, inspectedOrder]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ status }) 
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  const seedProducts = async () => {
    setSeeding(true); 
    setSeedStatus('Seeding all products from JSON price list into Database...');
    try {
      const res = await fetch('/api/admin/seed-products', { method: 'POST' });
      const data = await res.json();
      if (res.ok) { 
        setSeedStatus(`✅ Successfully seeded ${data.totalInserted} products!`); 
        fetchData(); 
      } else { 
        setSeedStatus(`❌ Failed: ${data.error}`); 
      }
    } catch { 
      setSeedStatus('❌ Database seed operation failed'); 
    }
    setSeeding(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Product?',
      message: `Are you sure you want to delete "${name}"? This action is permanent.`,
      confirmLabel: 'Delete Product',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await fetch(`/api/products/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) { console.error(err); }
      }
    });
  };

  const seedCombos = async () => {
    setSeedingCombos(true); 
    setSeedComboStatus('Seeding default package combos into Database...');
    try {
      const res = await fetch('/api/admin/seed-combos', { method: 'POST' });
      const data = await res.json();
      if (res.ok) { 
        setSeedComboStatus(`✅ Successfully seeded ${data.totalInserted} combo packs!`); 
        fetchData(); 
      } else { 
        setSeedComboStatus(`❌ Failed: ${data.error}`); 
      }
    } catch { 
      setSeedComboStatus('❌ Combo seed operation failed'); 
    }
    setSeedingCombos(false);
  };

  const handleDeleteCombo = (id: string, name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Combo Pack?',
      message: `Are you sure you want to delete the "${name}" combo? This action is permanent.`,
      confirmLabel: 'Delete Combo',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await fetch(`/api/combos/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) { console.error(err); }
      }
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('Uploading spreadsheet data...');
    const fd = new FormData(); 
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST', body: fd });
      const data = await res.json();
      setUploadStatus(res.ok ? `🎉 Imported ${data.count} products successfully!` : data.error);
      if (res.ok) {
        setFile(null);
        fetchData();
      }
    } catch { 
      setUploadStatus('Spreadsheet upload failed'); 
    }
  };

  const handleManualReceiptDownload = async (order: any) => {
    try {
      const orderItems = Array.isArray(order.items) 
        ? order.items.map((i: any) => ({
            name: i.name || i.product_name || 'Fireworks Item',
            quantity: i.quantity,
            price: i.price,
            mrp: i.mrp || i.original_price || i.price,
          }))
        : [];
      
      const { generateReceipt, downloadReceipt } = await import('@/lib/pdf/receiptGenerator');
      const doc = await generateReceipt({
        orderNumber: order.order_number,
        date: new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        customerCity: order.customer_city,
        customerPincode: order.customer_pincode,
        customerState: order.customer_state || '',
        customerDistrict: order.customer_district || '',
        items: orderItems,
        subtotal: order.subtotal || order.total_amount,
        discountTotal: order.discount_total || 0,
        totalAmount: order.total_amount,
      });
      downloadReceipt(doc, order.order_number);
    } catch (e) {
      console.error('Receipt generation error:', e);
    }
  };

  const handleResendReceiptEmail = async (order: any) => {
    setResendingEmailId(order.id);
    try {
      const orderItems = Array.isArray(order.items)
        ? order.items.map((i: any) => ({
            name: i.name || i.product_name || 'Fireworks Item',
            quantity: i.quantity,
            price: i.price,
            mrp: i.mrp || i.original_price || i.price,
          }))
        : [];

      const res = await fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.customer_email,
          orderNumber: order.order_number,
          customerName: order.customer_name,
          items: orderItems,
          totalAmount: order.total_amount,
          subtotal: order.subtotal || order.total_amount,
          discountTotal: order.discount_total || 0,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.skipped ? 'Mock email simulated (Resend key missing)' : 'Invoice email sent successfully!');
      } else {
        alert(`Failed to send: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Network error sending email');
    } finally {
      setResendingEmailId(null);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#0A0A08]" />;
  if (!isAuthenticated) return <AdminLogin onLogin={login} />;

  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
  const confirmedOrders = orders.filter((o: any) => o.status === 'confirmed' || o.status === 'delivered').length;

  const tabs = [
    { id: 'overview', label: 'Command Hub', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders Log', icon: ShoppingCart },
    { id: 'products', label: 'Inventory', icon: Package },
    { id: 'combos', label: 'Combos & Packs', icon: Gift },
    { id: 'enquiries', label: 'Enquiries', icon: MessageCircle },
    { id: 'messages', label: 'Inbox', icon: Mail },
    { id: 'analytics', label: 'Market Analytics', icon: BarChart3 },
    { id: 'diagnostics', label: 'System Logs', icon: Database },
  ];

  // Filtering list items
  const filteredOrders = orders.filter(o => 
    o.order_number?.toLowerCase().includes(orderQuery.toLowerCase()) || 
    o.customer_name?.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.customer_phone?.toLowerCase().includes(orderQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    (p.name_en || p.product_name)?.toLowerCase().includes(productQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(productQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A08] text-[#F5F5F0] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#141412] border-b md:border-b-0 md:border-r border-[#2A2A24] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#2A2A24] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#2A2A24] relative bg-[#1C1C18]">
            <Image src="/jj-crackers-logo.png" alt="Logo" fill className="object-contain p-1" sizes="40px" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-tight">JJ COMMAND</h1>
            <p className="text-[10px] text-[var(--color-gold)] font-bold tracking-widest uppercase">Admin Desk</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {tabs.map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === t.id 
                  ? 'bg-gradient-to-r from-[var(--color-gold)]/10 to-[var(--color-gold-dark)]/5 text-[var(--color-gold)] border border-[var(--color-gold)]/20 shadow-[0_2px_10px_rgba(212,175,55,0.02)]' 
                  : 'text-[#A0A090] hover:text-[#F5F5F0] hover:bg-[#1C1C18] border border-transparent'
              }`}
            >
              <span className="flex items-center gap-3">
                <t.icon size={18} className={activeTab === t.id ? 'text-[var(--color-gold)]' : ''} />
                {t.label}
              </span>
              {t.id === 'orders' && pendingOrders > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {pendingOrders}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-[#2A2A24] flex items-center justify-between">
          <button 
            onClick={logout} 
            className="flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/15 transition-all w-full justify-center"
          >
            <LogOut size={13} /> End Admin Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="h-16 border-b border-[#2A2A24] bg-[#141412]/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-[#A0A090] font-semibold">Active Session &bull; Secured Connection</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData} 
              className="p-2 rounded-lg hover:bg-[#1C1C18] text-[#A0A090] hover:text-[#F5F5F0] transition-colors border border-transparent hover:border-[#2A2A24]"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={ShoppingCart} label="Total Orders" value={orders.length} color="bg-blue-500/10 text-blue-400" />
                <StatCard icon={DollarSign} label="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} color="bg-emerald-500/10 text-emerald-400" />
                <StatCard icon={Clock} label="Pending Enquiries" value={pendingOrders} color="bg-amber-500/10 text-amber-400" />
                <StatCard icon={Package} label="Products Catalog" value={products.length} color="bg-purple-500/10 text-purple-400" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Card */}
                <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-base text-[#F5F5F0]">Recent Sales Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-[var(--color-gold)] font-bold hover:underline flex items-center gap-1">
                      View Log <ChevronRight size={12} />
                    </button>
                  </div>
                  
                  <div className="divide-y divide-[#2A2A24]/60 flex-grow">
                    {orders.slice(0, 5).map((o: any) => (
                      <div 
                        key={o.id} 
                        onClick={() => setInspectedOrder(o)}
                        className="flex items-center justify-between py-3.5 hover:bg-[#1C1C18]/40 px-2 rounded-xl transition-all cursor-pointer group"
                      >
                        <div>
                          <div className="font-bold text-sm text-[var(--color-gold)] group-hover:text-[var(--color-gold-light)] transition-colors">{o.order_number}</div>
                          <div className="text-xs text-[#A0A090] mt-0.5">{o.customer_name}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm">₹{o.total_amount?.toLocaleString('en-IN')}</span>
                          <StatusBadge status={o.status} />
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-[#A0A090] text-sm text-center py-12">No orders recorded yet</div>
                    )}
                  </div>
                </div>

                {/* Recent Messages Card */}
                <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-base text-[#F5F5F0]">Recent Inquiry Messages</h3>
                    <button onClick={() => setActiveTab('messages')} className="text-xs text-[var(--color-gold)] font-bold hover:underline flex items-center gap-1">
                      Open Inbox <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="divide-y divide-[#2A2A24]/60 flex-grow">
                    {messages.slice(0, 5).map((m: any) => (
                      <div key={m.id} className="py-3.5 px-2">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-sm text-[#F5F5F0]">{m.name}</span>
                          <span className="text-[10px] text-[#A0A090] font-semibold">{new Date(m.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-[#A0A090] line-clamp-2 leading-relaxed">
                          <span className="text-[var(--color-gold)] font-semibold">{m.subject}:</span> {m.message}
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-[#A0A090] text-sm text-center py-12">No messages in inbox</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#F5F5F0]">Sales Orders Log</h2>
                  <p className="text-xs text-[#A0A090] mt-1">Review orders list, inspect invoices, print receipts and update logs</p>
                </div>
                
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A090]" />
                  <input 
                    type="text" 
                    placeholder="Search by order ID, name..." 
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    className="w-full bg-[#141412] border border-[#2A2A24] rounded-xl py-2 pl-10 pr-4 text-xs text-[#F5F5F0] placeholder-[#A0A090]/40 focus:border-[var(--color-gold)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#2A2A24] bg-[#1C1C18]/40 text-[#A0A090] font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Order Code</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Products count</th>
                        <th className="p-4 text-right">Invoiced Amount</th>
                        <th className="p-4 text-center">Order Status</th>
                        <th className="p-4 text-center">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A24]/40">
                      {filteredOrders.map((o: any) => (
                        <tr key={o.id} className="hover:bg-[#1C1C18]/20 transition-colors">
                          <td className="p-4 font-bold text-[var(--color-gold)]">{o.order_number}</td>
                          <td className="p-4">
                            <div className="font-bold text-[#F5F5F0]">{o.customer_name}</div>
                            <div className="text-[10px] text-[#A0A090] mt-0.5">{o.customer_phone}</div>
                          </td>
                          <td className="p-4 text-[#A0A090]">
                            {Array.isArray(o.items) ? o.items.length : 0} line items
                          </td>
                          <td className="p-4 text-right font-bold text-[#F5F5F0]">
                            ₹{o.total_amount?.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 text-center">
                            <StatusBadge status={o.status} />
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => setInspectedOrder(o)}
                              className="px-3 py-1.5 bg-[#1C1C18] border border-[#2A2A24] hover:border-[var(--color-gold)] rounded-lg font-bold text-[#F5F5F0] hover:text-[var(--color-gold)] transition-all flex items-center gap-1.5 mx-auto"
                            >
                              <Eye size={12} /> View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-16 text-[#A0A090]">No orders found matching the filter query</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* COMBOS TAB */}
          {activeTab === 'combos' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#F5F5F0]">Combo Packages</h2>
                  <p className="text-xs text-[#A0A090] mt-1">Manage budget combo giftboxes and featured assortment packs</p>
                </div>
              </div>

              {/* Seed Combos card */}
              <div className="bg-gradient-to-r from-[var(--color-gold)]/5 via-transparent to-transparent border border-[var(--color-gold)]/20 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2 text-[#F5F5F0]">
                      <Gift size={16} className="text-[var(--color-gold)]" /> Populate Initial Assortment Combos
                    </h3>
                    <p className="text-xs text-[#A0A090] mt-1">Load the young kids, young couple, and premium family combos to seed the database catalog</p>
                  </div>
                  <button 
                    onClick={seedCombos} 
                    disabled={seedingCombos} 
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold text-xs disabled:opacity-50 flex items-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all shrink-0"
                  >
                    {seedingCombos ? <RefreshCw size={13} className="animate-spin" /> : <Database size={13} />}
                    {seedingCombos ? 'Seeding Database...' : 'Seed Default Combos'}
                  </button>
                </div>
                {seedComboStatus && (
                  <p className="mt-3 text-xs font-semibold text-[var(--color-gold)]">{seedComboStatus}</p>
                )}
              </div>

              {/* Combo table */}
              <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#2A2A24] bg-[#1C1C18]/40 text-[#A0A090] font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Combo Identifier Name</th>
                        <th className="p-4 text-center">Items Included</th>
                        <th className="p-4 text-right">Standard MRP</th>
                        <th className="p-4 text-right">Offer Sale Price</th>
                        <th className="p-4 text-center">Featured status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A24]/40">
                      {combos.map((c: any) => (
                        <tr key={c.id} className="hover:bg-[#1C1C18]/20 transition-colors">
                          <td className="p-4 font-bold text-[#F5F5F0]">{c.combo_name}</td>
                          <td className="p-4 text-center text-[#A0A090] font-bold">{c.total_items} items</td>
                          <td className="p-4 text-right line-through text-[#A0A090]">₹{c.original_price}</td>
                          <td className="p-4 text-right font-bold text-[var(--color-gold)]">₹{c.offer_price}</td>
                          <td className="p-4 text-center">
                            {c.featured ? (
                              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">Featured</span>
                            ) : (
                              <span className="text-[#A0A090]">-</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleDeleteCombo(c.id, c.combo_name)} 
                              className="p-2 text-rose-400 hover:bg-rose-400/10 border border-transparent hover:border-rose-500/10 rounded-lg transition-colors"
                              title="Delete Combo"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {combos.length === 0 && (
                    <div className="text-center py-16 text-[#A0A090]">No combo packs found. Initialize by clicking &quot;Seed Default Combos&quot; above.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#F5F5F0]">Product Inventory</h2>
                  <p className="text-xs text-[#A0A090] mt-1">Review inventory items, import database tables from spreadsheets or seed defaults</p>
                </div>
                
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A090]" />
                  <input 
                    type="text" 
                    placeholder="Search by english english title, category..." 
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    className="w-full bg-[#141412] border border-[#2A2A24] rounded-xl py-2 pl-10 pr-4 text-xs text-[#F5F5F0] placeholder-[#A0A090]/40 focus:border-[var(--color-gold)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Seed Products card */}
              <div className="bg-gradient-to-r from-[var(--color-gold)]/5 via-transparent to-transparent border border-[var(--color-gold)]/20 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2 text-[#F5F5F0]">
                      <Zap size={16} className="text-[var(--color-gold)]" /> Populate Default Product Line
                    </h3>
                    <p className="text-xs text-[#A0A090] mt-1">Insert all default safety-certified Sivakasi products from JSON templates directly into database catalog</p>
                  </div>
                  <button 
                    onClick={seedProducts} 
                    disabled={seeding} 
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold text-xs disabled:opacity-50 flex items-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all shrink-0"
                  >
                    {seeding ? <RefreshCw size={13} className="animate-spin" /> : <Database size={13} />}
                    {seeding ? 'Seeding...' : 'Seed Default Catalog'}
                  </button>
                </div>
                {seedStatus && (
                  <p className="mt-3 text-xs font-semibold text-[var(--color-gold)]">{seedStatus}</p>
                )}
              </div>

              {/* Excel upload */}
              <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl p-6">
                <h3 className="font-display font-bold text-sm mb-2 text-[#F5F5F0]">Import Inventory Spreadsheet</h3>
                <p className="text-xs text-[#A0A090] mb-5">Upload an Excel `.xlsx` spreadsheet matching the price list format to update pricing tables in bulk</p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <label className="flex-grow flex items-center justify-center gap-3 px-6 py-5 border-2 border-dashed border-[#2A2A24] hover:border-[var(--color-gold)]/40 rounded-xl cursor-pointer bg-[#1C1C18]/25 transition-all">
                    <Upload size={18} className="text-[#A0A090]" />
                    <span className="text-xs font-bold text-[#A0A090]">{file ? file.name : 'Select spreadsheet file (.xlsx)'}</span>
                    <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                  <button 
                    onClick={handleUpload} 
                    disabled={!file} 
                    className="px-6 py-4 rounded-xl bg-[var(--color-gold)] text-[#1a1400] font-bold text-xs hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all disabled:opacity-40 disabled:hover:shadow-none shrink-0"
                  >
                    Import Products
                  </button>
                </div>
                {uploadStatus && (
                  <p className="mt-3 text-xs font-semibold text-[var(--color-gold)]">{uploadStatus}</p>
                )}
              </div>

              {/* Products Catalog Table */}
              <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#2A2A24] bg-[#1C1C18]/40 text-[#A0A090] font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">English / Tamil Label Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Standard MRP</th>
                        <th className="p-4 text-right">Discounted Price</th>
                        <th className="p-4 text-center">Discount Saved</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A24]/40">
                      {filteredProducts.map((p: any) => (
                        <tr key={p.id} className="hover:bg-[#1C1C18]/20 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-[#F5F5F0]">{p.name_en}</div>
                            {p.name_ta && <div className="text-[10px] text-[#A0A090] mt-0.5">{p.name_ta}</div>}
                          </td>
                          <td className="p-4 text-[#A0A090] font-medium capitalize">{p.category}</td>
                          <td className="p-4 text-right line-through text-[#A0A090]">₹{p.mrp}</td>
                          <td className="p-4 text-right font-bold text-[var(--color-gold)]">₹{p.price}</td>
                          <td className="p-4 text-center text-emerald-400 font-bold">{p.discount_percent || 0}% OFF</td>
                          <td className="p-4 text-center">
                            {p.in_stock ? (
                              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/15 text-[10px]">In Stock</span>
                            ) : (
                              <span className="text-rose-400 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/15 text-[10px]">Out of Stock</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleDeleteProduct(p.id, p.name_en)} 
                              className="p-2 text-rose-400 hover:bg-rose-400/10 border border-transparent hover:border-rose-500/10 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16 text-[#A0A090]">No products found matching the query list</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-display text-[#F5F5F0]">Order Enquiries</h2>
                <p className="text-xs text-[#A0A090] mt-1">Review enquiries submitted by potential customers listing items cart summary</p>
              </div>

              <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl overflow-hidden">
                <div className="divide-y divide-[#2A2A24]/40">
                  {enquiries.map((e: any) => (
                    <div key={e.id} className="p-5 hover:bg-[#1C1C18]/10 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                        <div>
                          <span className="font-bold text-sm text-[#F5F5F0]">{e.customer_name || 'Enquirer Customer'}</span>
                          <span className="text-[10px] text-[#A0A090] font-semibold bg-[#1C1C18] border border-[#2A2A24] px-2 py-0.5 rounded-full ml-2">Phone: {e.customer_phone}</span>
                        </div>
                        <span className="text-[10px] text-[#A0A090] font-semibold">{new Date(e.created_at).toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-[#A0A090] flex items-center gap-4">
                        <span>Items: <strong className="text-[#F5F5F0]">{Array.isArray(e.items) ? e.items.length : 0} types</strong></span>
                        <span>Estimated Order: <strong className="text-[var(--color-gold)]">₹{e.total_amount?.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>
                  ))}
                  {enquiries.length === 0 && (
                    <div className="text-center py-16 text-[#A0A090]">No enquiries logged in database</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-display text-[#F5F5F0]">Inbox Messages</h2>
                <p className="text-xs text-[#A0A090] mt-1">Review details from customers submitted through the web contact support forms</p>
              </div>

              <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl overflow-hidden">
                <div className="divide-y divide-[#2A2A24]/40">
                  {messages.map((m: any) => (
                    <div key={m.id} className="p-6 hover:bg-[#1C1C18]/10 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                        <div>
                          <span className="font-bold text-sm text-[#F5F5F0]">{m.name}</span>
                          <span className="text-xs text-[#A0A090] ml-2">Email: {m.email}</span>
                        </div>
                        <span className="text-[10px] text-[#A0A090] font-semibold">{new Date(m.created_at).toLocaleString()}</span>
                      </div>
                      <div className="text-sm font-bold text-[var(--color-gold)] mb-2">{m.subject}</div>
                      <p className="text-xs text-[#A0A090] leading-relaxed bg-[#1C1C18]/40 border border-[#2A2A24]/60 p-4 rounded-xl">{m.message}</p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-16 text-[#A0A090]">No contact messages recorded</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-xl font-bold font-display text-[#F5F5F0]">Market Intelligence Analytics</h2>
                <p className="text-xs text-[#A0A090] mt-1">Explore sales performance charts, conversion rates, and inventory segmentation statistics</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={TrendingUp} label="Order Conversion Rate" value={orders.length > 0 ? `${Math.round((confirmedOrders / orders.length) * 100)}%` : '0%'} color="bg-emerald-500/10 text-emerald-400" />
                <StatCard icon={DollarSign} label="Average Order Value" value={orders.length > 0 ? `₹${Math.round(totalRevenue / orders.length).toLocaleString('en-IN')}` : '₹0'} color="bg-blue-500/10 text-blue-400" />
                <StatCard icon={Users} label="Total Enquiries Saved" value={enquiries.length} color="bg-purple-500/10 text-purple-400" />
                <StatCard icon={Mail} label="Inbox Count" value={messages.length} color="bg-amber-500/10 text-amber-400" />
              </div>

              {/* Progress bars categories */}
              <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl p-6">
                <h3 className="font-display font-bold text-sm mb-6 text-[#F5F5F0]">Products Segmentation by Category</h3>
                <div className="space-y-4">
                  {Object.entries(products.reduce((acc: any, p: any) => { 
                    acc[p.category] = (acc[p.category] || 0) + 1; 
                    return acc; 
                  }, {})).map(([cat, count]) => {
                    const percentage = products.length > 0 ? Math.round(((count as number) / products.length) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="capitalize text-[#F5F5F0]">{cat.replace('-', ' ')}</span>
                          <span className="text-[#A0A090]">{count as number} products ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-[#1C1C18] border border-[#2A2A24] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${percentage}%` }} 
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-full" 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Orders status grids */}
              <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl p-6">
                <h3 className="font-display font-bold text-sm mb-6 text-[#F5F5F0]">Orders Categorization Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => {
                    const count = orders.filter((o: any) => o.status === s).length;
                    return (
                      <div key={s} className="bg-[#1C1C18]/60 border border-[#2A2A24] p-4 rounded-xl text-center flex flex-col justify-between items-center gap-3">
                        <div className="text-xl font-bold font-display text-[#F5F5F0]">{count}</div>
                        <StatusBadge status={s} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* DIAGNOSTICS TAB */}
          {activeTab === 'diagnostics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-xl font-bold font-display text-[#F5F5F0]">System Diagnostics & Tracking Logs</h2>
                <p className="text-xs text-[#A0A090] mt-1">Review live application error logs, tracking information, and system event triggers</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Error Logs Card */}
                <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl p-6 flex flex-col h-[500px]">
                  <div className="flex items-center justify-between mb-5 shrink-0">
                    <h3 className="font-display font-bold text-base text-[#F5F5F0] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      Trapped Error Logs ({errorLogs.length})
                    </h3>
                    <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                      Real-time
                    </span>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto divide-y divide-[#2A2A24]/60 pr-1 scrollbar-thin">
                    {errorLogs.map((log) => (
                      <div key={log.id} className="py-3.5 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                            {log.error_type}
                          </span>
                          <span className="text-[9px] text-[#A0A090] font-semibold">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#F5F5F0] font-medium leading-relaxed">
                          {log.message}
                        </p>
                        {log.context && (
                          <div className="bg-[#1C1C18] border border-[#2A2A24]/60 rounded-lg p-2.5 font-mono text-[9px] text-[var(--color-gold)] overflow-x-auto">
                            <span className="text-white/40 block mb-1 font-bold text-[8px] uppercase tracking-wider">Error Context:</span>
                            {JSON.stringify(log.context, null, 2)}
                          </div>
                        )}
                        {log.stack && (
                          <details className="text-[9px] text-white/40 cursor-pointer">
                            <summary className="hover:text-white transition-colors">View Stack Trace</summary>
                            <pre className="mt-2 p-2 bg-black/40 border border-[#2A2A24]/40 rounded-lg overflow-x-auto font-mono text-[8px] whitespace-pre">
                              {log.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                    {errorLogs.length === 0 && (
                      <div className="text-[#A0A090] text-xs text-center py-24">No errors trapped in logs yet</div>
                    )}
                  </div>
                </div>

                {/* Analytics Events Card */}
                <div className="bg-[#141412] border border-[#2A2A24] rounded-2xl p-6 flex flex-col h-[500px]">
                  <div className="flex items-center justify-between mb-5 shrink-0">
                    <h3 className="font-display font-bold text-base text-[#F5F5F0] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Event Activity Stream ({analyticsEvents.length})
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto divide-y divide-[#2A2A24]/60 pr-1 scrollbar-thin">
                    {analyticsEvents.map((event) => (
                      <div key={event.id} className="py-3.5 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            {event.event_name}
                          </span>
                          <span className="text-[9px] text-[#A0A090] font-semibold">
                            {new Date(event.created_at).toLocaleString()}
                          </span>
                        </div>
                        {event.category && (
                          <span className="text-[9px] text-[#A0A090] uppercase font-bold tracking-wider block">
                            Category: {event.category}
                          </span>
                        )}
                        {event.metadata && (
                          <div className="bg-[#1C1C18] border border-[#2A2A24]/60 rounded-lg p-2.5 font-mono text-[9px] text-emerald-300/80 overflow-x-auto">
                            {JSON.stringify(event.metadata, null, 2)}
                          </div>
                        )}
                      </div>
                    ))}
                    {analyticsEvents.length === 0 && (
                      <div className="text-[#A0A090] text-xs text-center py-24">No events registered yet</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* FLYOUT ORDER INSPECTOR DRAWER */}
      <AnimatePresence>
        {inspectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[90]" 
              onClick={() => setInspectedOrder(null)} 
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-[#141412] border-l border-[#2A2A24] z-[91] shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#2A2A24] flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#F5F5F0]">{inspectedOrder.order_number}</h3>
                  <p className="text-[10px] text-[#A0A090] mt-0.5">Recorded: {new Date(inspectedOrder.created_at).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setInspectedOrder(null)}
                  className="p-2 rounded-lg hover:bg-[#1C1C18] text-[#A0A090] hover:text-[#F5F5F0] transition-colors border border-transparent hover:border-[#2A2A24]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
                
                {/* Status Timeline Progress */}
                <div className="bg-[#1C1C18]/50 border border-[#2A2A24] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F5F5F0] uppercase tracking-wider text-[10px]">Track Progress & Status</span>
                    <StatusBadge status={inspectedOrder.status} />
                  </div>

                  {/* Status selection update */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#A0A090] font-bold uppercase tracking-wider">Update Order Status</label>
                    <select 
                      value={inspectedOrder.status} 
                      onChange={(e) => updateOrderStatus(inspectedOrder.id, e.target.value)}
                      className="w-full bg-[#1C1C18] border border-[#2A2A24] text-[#F5F5F0] font-bold rounded-xl py-2 px-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors text-xs"
                    >
                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer Details Box */}
                <div className="bg-[#1C1C18]/30 border border-[#2A2A24] rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-[10px] text-[var(--color-gold)] uppercase tracking-wider border-b border-[#2A2A24] pb-2">Customer Details</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <User size={13} className="text-[#A0A090]" />
                      <span className="font-bold text-[#F5F5F0]">{inspectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={13} className="text-[#A0A090]" />
                      <span className="text-[#A0A090]">{inspectedOrder.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={13} className="text-[#A0A090]" />
                      <span className="text-[#A0A090]">{inspectedOrder.customer_phone}</span>
                    </div>
                    <div className="flex items-center gap-3 pt-1.5 border-t border-[#2A2A24]/40 mt-1">
                      <DollarSign size={13} className="text-[#A0A090]" />
                      <span className="text-[#A0A090]">Payment Method: <strong className="text-[var(--color-gold)] font-bold">Bank Transfer / GPay / PhonePe</strong></span>
                    </div>
                    {inspectedOrder.customer_address && (
                      <div className="flex items-start gap-3 mt-1 pt-1 border-t border-[#2A2A24]/40">
                        <MapPin size={13} className="text-[#A0A090] mt-0.5 shrink-0" />
                        <div className="text-[#A0A090] leading-relaxed">
                          {inspectedOrder.customer_address}
                          {(inspectedOrder.customer_city || inspectedOrder.customer_pincode) && (
                            <div className="font-semibold text-[#F5F5F0] mt-0.5">
                              {inspectedOrder.customer_city} {inspectedOrder.customer_pincode && ` - ${inspectedOrder.customer_pincode}`}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordered Items Table */}
                <div className="bg-[#1C1C18]/30 border border-[#2A2A24] rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-[10px] text-[var(--color-gold)] uppercase tracking-wider border-b border-[#2A2A24] pb-2">Ordered Items ({inspectedOrder.items?.length || 0})</h4>
                  
                  <div className="divide-y divide-[#2A2A24]/40">
                    {(inspectedOrder.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center gap-2">
                        <div>
                          <div className="font-bold text-[#F5F5F0]">{item.name || item.product_name}</div>
                          <div className="text-[10px] text-[#A0A090] mt-0.5">₹{item.price} &times; {item.quantity} units</div>
                        </div>
                        <div className="font-bold text-[#F5F5F0]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="pt-3 border-t border-[#2A2A24] space-y-2 text-xs">
                    <div className="flex justify-between text-[#A0A090]">
                      <span>Subtotal amount</span>
                      <span>₹{(inspectedOrder.subtotal || inspectedOrder.total_amount).toLocaleString('en-IN')}</span>
                    </div>
                    {inspectedOrder.discount_total > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Discount savings</span>
                        <span>-₹{inspectedOrder.discount_total.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#2A2A24] text-[var(--color-gold)]">
                      <span>Invoiced Total</span>
                      <span>₹{inspectedOrder.total_amount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Action Trigger Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <button 
                    onClick={() => handleManualReceiptDownload(inspectedOrder)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1C1C18] border border-[#2A2A24] hover:border-[var(--color-gold)] font-bold text-xs text-[#F5F5F0] hover:text-[var(--color-gold)] transition-all"
                  >
                    <Download size={13} /> Get PDF Receipt
                  </button>
                  
                  <button 
                    onClick={() => handleResendReceiptEmail(inspectedOrder)}
                    disabled={resendingEmailId === inspectedOrder.id}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)]/10 to-[var(--color-gold-dark)]/5 border border-[var(--color-gold)]/20 hover:border-[var(--color-gold)] font-bold text-xs text-[var(--color-gold)] transition-all disabled:opacity-40"
                  >
                    <Send size={13} className={resendingEmailId === inspectedOrder.id ? 'animate-pulse' : ''} /> 
                    {resendingEmailId === inspectedOrder.id ? 'Resending...' : 'Resend Email'}
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DIALOG MODAL CONFIRM */}
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        isDanger={confirmConfig.isDanger}
        onConfirm={confirmConfig.action}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

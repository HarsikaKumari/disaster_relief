/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import {
    Ambulance,
    ArrowLeft,
    Bell,
    Droplet,
    Home,
    Hospital,
    Loader2,
    Menu,
    Package,
    Plus,
    Search,
    Shirt,
    Truck,
    Utensils,
    Wifi,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sidebar } from '../components/layouts/sidebar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../lib/api';

// ============================================
// TYPES
// ============================================

const RESOURCE_TYPES = [
  { value: 'FOOD', label: '🍲 Food' },
  { value: 'WATER', label: '💧 Water' },
  { value: 'MEDICAL', label: '🏥 Medical' },
  { value: 'SHELTER', label: '🏠 Shelter' },
  { value: 'TRANSPORT', label: '🚛 Transport' },
  { value: 'RESCUE_TEAM', label: '🚑 Rescue Team' },
  { value: 'COMMUNICATION', label: '📡 Communication' },
  { value: 'SANITATION', label: '🧹 Sanitation' },
  { value: 'CLOTHING', label: '👕 Clothing' },
  { value: 'ELECTRICITY', label: '⚡ Electricity' },
  { value: 'OTHER', label: '📦 Other' },
];

// ============================================
// ADD RESOURCE PAGE
// ============================================

export const AddResource = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'FOOD',
    description: '',
    quantity: 1,
    availableQty: 1,
    unit: 'units',
    location: '',
    latitude: '',
    longitude: '',
    expiryDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        description: formData.description || undefined,
        quantity: parseInt(formData.quantity.toString()),
        availableQty: parseInt(formData.availableQty.toString()),
        unit: formData.unit || 'units',
        location: formData.location,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
      };

      const response = await api.post('/resources', payload);

      if (response.data.success) {
        toast.success('Resource added successfully!');
        navigate('/resources');
      } else {
        toast.error(response.data.message || 'Failed to add resource');
      }
    } catch (error: any) {
      console.error('Add resource error:', error);
      toast.error(error.response?.data?.message || 'Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FOOD': return <Utensils className="w-4 h-4" />;
      case 'WATER': return <Droplet className="w-4 h-4" />;
      case 'MEDICAL': return <Hospital className="w-4 h-4" />;
      case 'SHELTER': return <Home className="w-4 h-4" />;
      case 'TRANSPORT': return <Truck className="w-4 h-4" />;
      case 'RESCUE_TEAM': return <Ambulance className="w-4 h-4" />;
      case 'COMMUNICATION': return <Wifi className="w-4 h-4" />;
      case 'SANITATION': return <Shirt className="w-4 h-4" />;
      case 'CLOTHING': return <Shirt className="w-4 h-4" />;
      case 'ELECTRICITY': return <Zap className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const found = RESOURCE_TYPES.find(t => t.value === type);
    return found?.label || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        active="Resources"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ===== MAIN ===== */}
      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        
        {/* ===== NAVBAR ===== */}
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl m-3 md:m-4 p-3 shadow-lg shadow-primary/5 border border-white/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-xl hover:bg-sand-light/50"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>
            <div className="flex items-center gap-3">
              <Link to="/resources" className="p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Link>
              <div>
                <h1 className="text-base font-semibold text-text-primary">Add Resource</h1>
                <p className="text-xs text-text-tertiary">Add new relief resource</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30 shadow-sm">
              <Search className="w-3.5 h-3.5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search..."
                className="border-0 bg-transparent p-0 h-7 text-sm w-28 lg:w-40 focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-text-tertiary/60"
              />
            </div>
            <button className="relative p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/30" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-lg shadow-primary/20">
              JD
            </div>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-3 md:p-4 pb-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white/30">
              
              {/* Preview Card */}
              <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {getTypeIcon(formData.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {formData.name || 'Resource Name'}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {formData.type ? getTypeLabel(formData.type) : 'Select Type'} • {formData.quantity || 0} {formData.unit || 'units'}
                    </p>
                  </div>
                  <Badge className="ml-auto bg-success/10 text-success border-success/20">
                    New
                  </Badge>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Resource Name */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-text-primary">Resource Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Emergency Food Packets"
                    required
                    className="bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                  />
                </div>

                {/* Resource Type */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-text-primary">Resource Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-10 px-3 bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm text-text-primary appearance-none cursor-pointer"
                    required
                  >
                    {RESOURCE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-text-primary">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the resource..."
                    rows={3}
                    className="w-full bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary/60"
                  />
                </div>

                {/* Quantity & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      required
                      className="bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary">Unit *</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      placeholder="e.g. packets, kg, liters"
                      required
                      className="bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* Available Quantity */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-text-primary">Available Quantity</Label>
                  <Input
                    id="availableQty"
                    type="number"
                    value={formData.availableQty}
                    onChange={handleChange}
                    min="0"
                    className="bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                  />
                  <p className="text-xs text-text-tertiary">Leave blank to use same as quantity</p>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-text-primary">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Central Warehouse, Delhi"
                    required
                    className="bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                  />
                </div>

                {/* Latitude & Longitude */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary">Latitude</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="e.g. 28.6139"
                      className="bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary">Longitude</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="e.g. 77.209"
                      className="bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-text-primary">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/20">
                  <Link to="/resources" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-white/30 text-text-secondary hover:bg-white/50 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl shadow-lg shadow-primary/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Resource
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* ===== FOOTER ===== */}
          <div className="text-center text-[10px] text-text-tertiary/40 py-3 mt-4">
            © 2026 Disaster Relief Coordination Platform
          </div>
        </div>
      </div>
    </div>
  );
};
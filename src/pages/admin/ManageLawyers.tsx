// src/pages/admin/ManageLawyers.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Scale,
  X,
  Upload,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface Lawyer {
  id?: string;
  name: string;
  barNumber: string;
  yearsOfPractice: number;
  location: string;
  city: string;
  state: string;
  practiceAreas: string[];
  courts: string[];
  languages: string[];
  consultationFee: string;
  feeMin: number;
  feeMax: number;
  availability: string;
  image: string;
  verified: boolean;
  active: boolean;
  email: string;
  phone: string;
  rating?: number;
  totalCases?: number;
  successRate?: number;
  bio?: string;
  education?: string;
  barCouncil?: string;
}

const ManageLawyers = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Lawyer>>({
    name: '',
    barNumber: '',
    yearsOfPractice: 0,
    city: '',
    state: '',
    practiceAreas: [],
    courts: [],
    languages: [],
    feeMin: 0,
    feeMax: 0,
    availability: '',
    image: '',
    verified: true,
    active: true,
    email: '',
    phone: '',
    bio: '',
    education: '',
    barCouncil: '',
  });

  useEffect(() => {
    loadLawyers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = lawyers.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.practiceAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredLawyers(filtered);
    } else {
      setFilteredLawyers(lawyers);
    }
  }, [searchQuery, lawyers]);

  const loadLawyers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'lawyers'));
      const lawyersData: Lawyer[] = [];
      querySnapshot.forEach((doc) => {
        lawyersData.push({ id: doc.id, ...doc.data() } as Lawyer);
      });
      setLawyers(lawyersData);
      setFilteredLawyers(lawyersData);
    } catch (error) {
      console.error('Error loading lawyers:', error);
      toast.error('Failed to load lawyers');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, 'legal-ai-lawyers');
      if (result) {
        setFormData({ ...formData, image: result.secureUrl });
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.barNumber || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const lawyerData = {
        ...formData,
        location: `${formData.city}, ${formData.state}`,
        consultationFee: `₹${formData.feeMin?.toLocaleString()} - ₹${formData.feeMax?.toLocaleString()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingLawyer?.id) {
        // Update existing
        await updateDoc(doc(db, 'lawyers', editingLawyer.id), lawyerData);
        toast.success('Lawyer updated successfully');
      } else {
        // Add new
        await addDoc(collection(db, 'lawyers'), lawyerData);
        toast.success('Lawyer added successfully');
      }

      setShowModal(false);
      setEditingLawyer(null);
      resetForm();
      loadLawyers();
    } catch (error) {
      console.error('Error saving lawyer:', error);
      toast.error('Failed to save lawyer');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lawyer: Lawyer) => {
    setEditingLawyer(lawyer);
    setFormData({
      name: lawyer.name,
      barNumber: lawyer.barNumber,
      yearsOfPractice: lawyer.yearsOfPractice,
      city: lawyer.city,
      state: lawyer.state,
      practiceAreas: lawyer.practiceAreas,
      courts: lawyer.courts,
      languages: lawyer.languages,
      feeMin: lawyer.feeMin,
      feeMax: lawyer.feeMax,
      availability: lawyer.availability,
      image: lawyer.image,
      verified: lawyer.verified,
      active: lawyer.active,
      email: lawyer.email,
      phone: lawyer.phone,
      bio: lawyer.bio,
      education: lawyer.education,
      barCouncil: lawyer.barCouncil,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lawyer?')) return;

    try {
      await deleteDoc(doc(db, 'lawyers', id));
      toast.success('Lawyer deleted successfully');
      loadLawyers();
    } catch (error) {
      console.error('Error deleting lawyer:', error);
      toast.error('Failed to delete lawyer');
    }
  };

  const toggleActive = async (lawyer: Lawyer) => {
    try {
      await updateDoc(doc(db, 'lawyers', lawyer.id!), {
        active: !lawyer.active,
        updatedAt: new Date().toISOString(),
      });
      toast.success(`Lawyer ${!lawyer.active ? 'activated' : 'deactivated'}`);
      loadLawyers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      barNumber: '',
      yearsOfPractice: 0,
      city: '',
      state: '',
      practiceAreas: [],
      courts: [],
      languages: [],
      feeMin: 0,
      feeMax: 0,
      availability: '',
      image: '',
      verified: true,
      active: true,
      email: '',
      phone: '',
      bio: '',
      education: '',
      barCouncil: '',
    });
  };

  const addArrayItem = (field: 'practiceAreas' | 'courts' | 'languages', value: string) => {
    if (!value.trim()) return;
    const current = formData[field] || [];
    if (!current.includes(value.trim())) {
      setFormData({ ...formData, [field]: [...current, value.trim()] });
    }
  };

  const removeArrayItem = (field: 'practiceAreas' | 'courts' | 'languages', value: string) => {
    const current = formData[field] || [];
    setFormData({ ...formData, [field]: current.filter(item => item !== value) });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold gradient-text">Admin Panel</span>
            </Link>
            <h1 className="text-lg font-semibold">Manage Lawyers</h1>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Add */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search lawyers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
            />
          </div>
          <motion.button
            onClick={() => {
              resetForm();
              setEditingLawyer(null);
              setShowModal(true);
            }}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            Add Lawyer
          </motion.button>
        </div>

        {/* Lawyers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLawyers.map((lawyer) => (
              <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{lawyer.name}</h3>
                    <p className="text-sm text-muted-foreground">{lawyer.barNumber}</p>
                    <p className="text-xs text-muted-foreground">{lawyer.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {lawyer.active ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      Inactive
                    </span>
                  )}
                  {lawyer.verified && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(lawyer)}
                    className="flex-1 px-3 py-2 rounded-lg glass hover:bg-white/5 text-sm flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(lawyer)}
                    className="px-3 py-2 rounded-lg glass hover:bg-white/5"
                  >
                    {lawyer.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(lawyer.id!)}
                    className="px-3 py-2 rounded-lg glass hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={() => !loading && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl glass rounded-2xl p-6 border border-white/10 my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {editingLawyer ? 'Edit Lawyer' : 'Add New Lawyer'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Photo</label>
                  <div className="flex items-center gap-4">
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                    <label className="flex-1 px-4 py-3 rounded-xl glass border border-white/10 cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                      placeholder="Adv. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bar Number *</label>
                    <input
                      type="text"
                      value={formData.barNumber}
                      onChange={(e) => setFormData({ ...formData, barNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                      placeholder="D/1234/2020"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Practice</label>
                    <input
                      type="number"
                      value={formData.yearsOfPractice}
                      onChange={(e) => setFormData({ ...formData, yearsOfPractice: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Fee Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.feeMin}
                      onChange={(e) => setFormData({ ...formData, feeMin: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.feeMax}
                      onChange={(e) => setFormData({ ...formData, feeMax: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium mb-2">Availability</label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                    placeholder="Available within 24 hours"
                  />
                </div>

                {/* Arrays - Practice Areas, Courts, Languages */}
                {(['practiceAreas', 'courts', 'languages'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        id={`${field}-input`}
                        className="flex-1 px-4 py-2 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none text-sm"
                        placeholder={`Add ${field}`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            addArrayItem(field, input.value);
                            input.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`${field}-input`) as HTMLInputElement;
                          addArrayItem(field, input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData[field] || []).map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-2 border border-primary/20"
                        >
                          {item}
                          <button
                            onClick={() => removeArrayItem(field, item)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Bio, Education, Bar Council */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Brief professional biography..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Education</label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                      placeholder="LLB from..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bar Council</label>
                    <input
                      type="text"
                      value={formData.barCouncil}
                      onChange={(e) => setFormData({ ...formData, barCouncil: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                      placeholder="Bar Council of..."
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Verified</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl glass hover:bg-white/5 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingLawyer ? 'Update' : 'Add'} Lawyer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageLawyers;
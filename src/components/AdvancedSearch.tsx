// src/components/AdvancedSearch.tsx - FIXED with visible dropdown options
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  SlidersHorizontal,
  Save,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle
} from 'lucide-react';
import { CaseRecord } from '@/lib/storage';

export interface SearchFilters {
  keyword: string;
  caseType: string;
  status: string;
  urgency: 'all' | 'urgent' | 'normal';
  dateRange: { start: string; end: string };
  confidenceMin: number;
  severity: string;
  sortBy: 'date' | 'confidence' | 'severity';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  totalResults: number;
}

const defaultFilters: SearchFilters = {
  keyword: '',
  caseType: 'all',
  status: 'all',
  urgency: 'all',
  dateRange: { start: '', end: '' },
  confidenceMin: 0,
  severity: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

const AdvancedSearch = ({ onSearch, totalResults }: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedSearches, setSavedSearches] = useState<{ name: string; filters: SearchFilters }[]>([]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onSearch(defaultFilters);
  };

  const saveSearch = () => {
    const name = prompt('Name this search:');
    if (name) {
      const newSearch = { name, filters };
      const updated = [...savedSearches, newSearch];
      setSavedSearches(updated);
      localStorage.setItem('savedSearches', JSON.stringify(updated));
    }
  };

  const loadSavedSearch = (savedFilters: SearchFilters) => {
    setFilters(savedFilters);
    onSearch(savedFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'keyword') return value !== '';
    if (key === 'caseType') return value !== 'all';
    if (key === 'status') return value !== 'all';
    if (key === 'urgency') return value !== 'all';
    if (key === 'severity') return value !== 'all';
    if (key === 'dateRange') return value.start !== '' || value.end !== '';
    if (key === 'confidenceMin') return value > 0;
    return false;
  }).length;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search cases by description, type, or legal section..."
            value={filters.keyword}
            onChange={(e) => updateFilter('keyword', e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Advanced Toggle */}
        <motion.button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-colors ${
            showAdvanced || activeFiltersCount > 0
              ? 'bg-primary text-primary-foreground'
              : 'glass hover:bg-white/5'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:inline">
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
        </motion.button>

        {/* Reset */}
        {activeFiltersCount > 0 && (
          <motion.button
            onClick={resetFilters}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl glass hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{totalResults} case{totalResults !== 1 ? 's' : ''} found</span>
        {activeFiltersCount > 0 && (
          <span className="text-primary">{activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active</span>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-6 space-y-6">
              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Case Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Case Type</label>
                  <select
                    value={filters.caseType}
                    onChange={(e) => updateFilter('caseType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none text-sm bg-background text-foreground"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="all" className="bg-background text-foreground">All Types</option>
                    <option value="criminal" className="bg-background text-foreground">Criminal</option>
                    <option value="civil" className="bg-background text-foreground">Civil</option>
                    <option value="family" className="bg-background text-foreground">Family</option>
                    <option value="property" className="bg-background text-foreground">Property</option>
                    <option value="cyber" className="bg-background text-foreground">Cyber</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilter('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none text-sm bg-background text-foreground"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="all" className="bg-background text-foreground">All Status</option>
                    <option value="draft" className="bg-background text-foreground">Draft</option>
                    <option value="submitted" className="bg-background text-foreground">Submitted</option>
                    <option value="under_review" className="bg-background text-foreground">Under Review</option>
                    <option value="closed" className="bg-background text-foreground">Closed</option>
                  </select>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium mb-2">Urgency</label>
                  <select
                    value={filters.urgency}
                    onChange={(e) => updateFilter('urgency', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none text-sm bg-background text-foreground"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="all" className="bg-background text-foreground">All</option>
                    <option value="urgent" className="bg-background text-foreground">Urgent Only</option>
                    <option value="normal" className="bg-background text-foreground">Normal Only</option>
                  </select>
                </div>

                {/* Date Range Start */}
                <div>
                  <label className="block text-sm font-medium mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none text-sm bg-background text-foreground"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                {/* Date Range End */}
                <div>
                  <label className="block text-sm font-medium mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none text-sm bg-background text-foreground"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium mb-2">Severity</label>
                  <select
                    value={filters.severity}
                    onChange={(e) => updateFilter('severity', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none text-sm bg-background text-foreground"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="all" className="bg-background text-foreground">All</option>
                    <option value="High" className="bg-background text-foreground">High</option>
                    <option value="Medium" className="bg-background text-foreground">Medium</option>
                    <option value="Low" className="bg-background text-foreground">Low</option>
                  </select>
                </div>
              </div>

              {/* Confidence Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Confidence: {filters.confidenceMin}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={filters.confidenceMin}
                  onChange={(e) => updateFilter('confidenceMin', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Sort Options */}
              <div className="border-t border-white/10 pt-4">
                <label className="block text-sm font-medium mb-3">Sort By</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { value: 'date', label: 'Date', icon: Clock },
                    { value: 'confidence', label: 'Confidence', icon: TrendingUp },
                    { value: 'severity', label: 'Severity', icon: AlertCircle },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => updateFilter('sortBy', value)}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${
                        filters.sortBy === value
                          ? 'bg-primary text-primary-foreground'
                          : 'glass hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                  
                  {/* Sort Order */}
                  <button
                    onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 glass hover:bg-white/5 transition-colors"
                  >
                    {filters.sortOrder === 'asc' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {filters.sortOrder === 'asc' ? 'Asc' : 'Desc'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={saveSearch}
                  className="px-4 py-2 rounded-lg glass hover:bg-white/5 transition-colors text-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Search
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-lg glass hover:bg-white/5 transition-colors text-sm"
                >
                  Reset All
                </button>
              </div>

              {/* Saved Searches */}
              {savedSearches.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-medium mb-2">Saved Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {savedSearches.map((saved, index) => (
                      <button
                        key={index}
                        onClick={() => loadSavedSearch(saved.filters)}
                        className="px-3 py-1.5 rounded-lg glass hover:bg-primary/20 transition-colors text-xs flex items-center gap-2"
                      >
                        {saved.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;
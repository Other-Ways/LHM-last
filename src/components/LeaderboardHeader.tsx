import React, { useState } from 'react';
import { Settings, Filter, Plus } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { useDimensions } from '../hooks/useDimensions';
import { AddDimensionModal } from './AddDimensionModal';
import type { TimePeriod } from '../types/filters';

export const LeaderboardHeader = () => {
  const { filters, setFilters } = useFilters();
  const { dimensions, refetch } = useDimensions();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      dimensionId: value === 'all' ? 'all' : Number(value),
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      timePeriod: e.target.value as TimePeriod,
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FARGE Configuration Manager</h1>
              <p className="text-sm text-gray-500">Manage and configure your criteria settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dimension</span>
            </button>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                value={filters.dimensionId.toString()}
                onChange={handleDimensionChange}
              >
                <option value="all">All Dimensions</option>
                {dimensions.map((dimension) => (
                  <option key={dimension.dimension_id} value={dimension.dimension_id}>
                    {dimension.dimension_name}
                  </option>
                ))}
              </select>
            </div>
            <select
              className="px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              value={filters.timePeriod}
              onChange={handleTimeChange}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddDimensionModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </>
  );
};
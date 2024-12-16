import React from 'react';

const SearchBar = ({ searchTerm, handleSearchInputChange, handleSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof handleSearch === 'function') {
      handleSearch(searchTerm);  
    } else {
      console.error('handleSearch is not a function');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchInputChange}
        placeholder="Search by ID"
        className="p-2 text-sm border border-gray-300 rounded w-32"  
      />
      <button type="submit" className="p-2 text-sm bg-blue-500 text-white rounded">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

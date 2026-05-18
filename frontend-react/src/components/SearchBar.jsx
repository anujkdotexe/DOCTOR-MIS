import React from 'react'

export default function SearchBar({ value, onChange, onSearch, city = '', onCityChange, cityOptions = [] }){
  return (
    <div className="search-bar">
      <input placeholder="Doctor name or hospital" value={value} onChange={e=>onChange && onChange(e.target.value)} />
      <select value={city} onChange={e=>onCityChange && onCityChange(e.target.value)}>
        <option value="">All cities</option>
        {cityOptions.map(item => <option key={item} value={item}>{item}</option>)}
      </select>
      <button className="btn primary" type="button" onClick={onSearch}>Search</button>
    </div>
  )
}

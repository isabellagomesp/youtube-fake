function SearchBar({ searchText, onSearchChange }) {
    return (
      <input
        type="text"
        placeholder="Pesquisar vídeos..."
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        style={{
          width: 360,
          padding: 10,
          borderRadius: 20,
          border: "1px solid gray",
        }}
      />
    );
  }
  
  export default SearchBar;
import React from "react"

const SearchForm: React.FC = () => {
    return (
        <form className="center search" target="_blank" rel="noopener noreferrer" action="https://ultimate-guitar.com/search.php">
            <input hidden readOnly name="search_type" value="title"></input>
            <input type="text" placeholder="Search ultimate-guitar.com" name="value" />
            <button>Search</button>
        </form>
    )
}

export default SearchForm

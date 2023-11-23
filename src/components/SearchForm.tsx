import React, { type FormEventHandler } from "react"

interface Props {
    onSubmit: FormEventHandler
}

const SearchForm: React.FC<Props> = ({ onSubmit }) => {
    return (
        <form className="center search" onSubmit={onSubmit}>
            <input type="text" placeholder="Search ultimate-guitar.com" name="query" />
            <button>Search</button>
        </form>
    )
}

export default SearchForm

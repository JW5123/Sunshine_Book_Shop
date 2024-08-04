import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const Books = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get("http://localhost:8800/books");
                setBooks(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllBooks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete("http://localhost:8800/books/" + id);
            setBooks(books.filter(book => book.id !== id)); // Update local state
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Sunshine Book Shop</h1>
            <button className='formButton addButton'>
                <Link to="/add" style={{ textDecoration: 'none', color: 'white' }}>Add new book</Link>
            </button>
            <div className='books'>
                {books.map(book => (
                    <div className="book" key={book.id}>
                        {book.cover && <img src={`http://localhost:8800${book.cover}`} alt="" />}
                        <div className="bookDetails">
                            <h2>{book.title}</h2>
                            <p>{book.desc}</p>
                            <h4>Price: {book.price} $</h4>
                            <div className="bookActions">
                                <button className='update'>
                                    <Link to={`/update/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>Update</Link>
                                </button>
                                <button className='delete' onClick={() => handleDelete(book.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Books;

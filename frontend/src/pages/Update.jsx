import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Update = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: null,
        cover: ""
    });
    const [file, setFile] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const bookId = location.pathname.split("/")[2];

    // Fetch book details on component mount
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/books/${bookId}`);
                setBook(res.data);
                setIsLoaded(true);
            } catch (error) {
                console.log(error);
            }
        };
        fetchBook();
    }, [bookId]);

    const handleChange = (e) => {
        setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', book.title);
        formData.append('desc', book.desc);
        formData.append('price', book.price);
        formData.append('cover', file || book.cover);

        try {
            await axios.put(`http://localhost:8800/books/${bookId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    if (!isLoaded) 
        return <p>Loading...</p>;

    return (
        <div className='form'>
            <h1>Update the book</h1>
            <input type="text" placeholder='title' value={book.title} onChange={handleChange} name="title"/>
            <input type="text" placeholder='desc' value={book.desc} onChange={handleChange} name="desc" />
            <input type="text" placeholder='price' value={book.price} onChange={handleChange} name="price" />
            <input type="file" onChange={handleFileChange} name="cover"/>
            <button className='formButton' onClick={handleClick}>Update</button>
        </div>
    );
};

export default Update;

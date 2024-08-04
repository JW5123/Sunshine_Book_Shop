import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Add = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: null,
    });

    const [file, setFile] = useState(null);
    const navigate = useNavigate();

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
        if (file) formData.append('cover', file);

        try {
            await axios.post("http://localhost:8800/books", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='form'>
            <h1>Add new book</h1>
            <input type="text" placeholder='title' onChange={handleChange} name="title" />
            <input type="text" placeholder='desc' onChange={handleChange} name="desc" />
            <input type="text" placeholder='price' onChange={handleChange} name="price" />
            <input type="file" onChange={handleFileChange} name="cover" />
            <button className='formButton' onClick={handleClick}>Add</button>
        </div>
    );
}

export default Add;

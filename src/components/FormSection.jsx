import React, { useState, useEffect } from 'react';

const FormSection = ({ onUserRegistered }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position_id: '',
        photo: null
    });

    // Other state
    const [positions, setPositions] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE = 'https://frontend-test-assignment-api.abz.agency/api/v1';

    useEffect(() => {
        const loadPositions = async () => {
            await fetchPositions();
        };
        loadPositions();
    }, []);

    const fetchPositions = async () => {
        try {
            const response = await fetch(`${API_BASE}/positions`);
            const data = await response.json();

            if (data.success) {
                setPositions(data.positions);
                if (data.positions.length > 0) {
                    setFormData(prev => ({ ...prev, position_id: String(data.positions[0].id) }));
                }
            }
        } catch (error) {
            console.error('Error fetching positions:', error);
        }
    };

    const getToken = async () => {
        try {
            const response = await fetch(`${API_BASE}/token`, {
                method: 'POST'
            });
            const data = await response.json();

            if (data.success) {
                return data.token;
            }
            throw new Error('Failed to get token');
        } catch (error) {
            console.error('Error getting token:', error);
            throw error;
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else if (type === 'radio') {
            setFormData(prev => ({ ...prev, [name]: String(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const isFormComplete = () => {
        const { name, email, phone, position_id, photo } = formData;


        if (!name.trim() || !email.trim() || !phone.trim() || !position_id || !photo) {
            return false;
        }


        if (name.length < 2 || name.length > 60) {
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return false;
        }

        const phoneRegex = /^[+]?380([0-9]{9})$/;
        if (!phoneRegex.test(phone)) {
            return false;
        }

        if (photo) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(photo.type) || photo.size > maxSize) {
                return false;
            }
        }

        return true;
    };


    const validateForm = () => {
        const newErrors = {};


        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2 || formData.name.length > 60) {
            newErrors.name = 'Name must be 2-60 characters long';
        }


        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }


        const phoneRegex = /^[+]?380([0-9]{9})$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone must start with +380 and contain 9 digits after';
        }


        if (!formData.position_id) {
            newErrors.position_id = 'Please select a position';
        }


        if (!formData.photo) {
            newErrors.photo = 'Photo is required';
        } else {
            const file = formData.photo;
            const maxSize = 5 * 1024 * 1024;
            const allowedTypes = ['image/jpeg', 'image/jpg'];

            if (!allowedTypes.includes(file.type)) {
                newErrors.photo = 'Photo must be jpeg/jpg format';
            } else if (file.size > maxSize) {
                newErrors.photo = 'Photo size must not exceed 5MB';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const authToken = await getToken();

            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('position_id', formData.position_id);
            submitData.append('photo', formData.photo);

            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: {
                    'Token': authToken
                },
                body: submitData
            });

            const result = await response.json();

            if (result.success) {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    position_id: positions.length > 0 ? positions[0].id : '',
                    photo: null
                });

                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';

                if (onUserRegistered) {
                    onUserRegistered();
                }

                alert('User registered successfully!');
            } else {
                if (result.fails) {
                    const apiErrors = {};
                    Object.keys(result.fails).forEach(key => {
                        apiErrors[key] = result.fails[key][0];
                    });
                    setErrors(apiErrors);
                } else {
                    alert(result.message || 'Registration failed');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formComplete = isFormComplete();

    return (
        <section className="form-section">
            <div className="form-container">
                <h1 style={{textAlign: 'center', marginBottom: '50px'}}>Working with POST request</h1>

                <form onSubmit={handleSubmit} className="reg-form">
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your name"
                            className={errors.name ? 'error' : ''}
                        />
                        <label htmlFor="name" className="input-label">Your name</label>
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className={errors.email ? 'error' : ''}
                        />
                        <label htmlFor="email" className="input-label">Email</label>
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone"
                            className={errors.phone ? 'error' : ''}
                        />
                        <label htmlFor="phone" className="input-label">Phone</label>
                        <small className="helper-text">+38 (XXX) XXX - XX - XX</small>
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <p style={{margin: '0'}}>Select your position</p>
                        <div className="radio-group">
                            {positions.map(position => (
                                <label key={position.id} className="radio-label">
                                    <input
                                        type="radio"
                                        name="position_id"
                                        value={String(position.id)}
                                        checked={formData.position_id === String(position.id)}
                                        onChange={handleInputChange}
                                    />
                                    <span className="radio-custom"></span>
                                    {position.name}
                                </label>
                            ))}
                        </div>
                        {errors.position_id && <span className="error-message">{errors.position_id}</span>}
                    </div>

                    <div className="form-group">
                        <div className="file-upload">
                            <input
                                type="file"
                                name="photo"
                                id="photo"
                                accept="image/jpeg,image/jpg"
                                onChange={handleInputChange}
                                className="file-input"
                            />
                            <label htmlFor="photo" className="file-label">
                                <span className="upload-button">Upload</span>
                                <span className="file-text">
                  {formData.photo ? formData.photo.name : 'Upload your photo'}
                </span>
                            </label>
                        </div>
                        {errors.photo && <span className="error-message">{errors.photo}</span>}
                    </div>

                    <button
                        style={{alignSelf: 'center'}}
                        type="submit"
                        className={`btn btn-submit ${formComplete ? 'active' : ''}`}
                        disabled={!formComplete || isSubmitting}
                    >
                        {isSubmitting ? 'Signing up...' : 'Sign up'}
                    </button>
                </form>
            </div>


        </section>
    );
};

export default FormSection;
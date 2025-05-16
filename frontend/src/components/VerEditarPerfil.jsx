import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerEditarPerfil = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // adicionado se precisares mostrar email
    const [phone, setPhone] = useState('');
    const [profile_picture, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [message, setMessage] = useState('');

    const PROFILE_URL = 'http://localhost:8000/backend/users/profile/';

    const getCSRFToken = () => {
        return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    };

    useEffect(() => {
        axios.get(PROFILE_URL, { withCredentials: true })
            .then(res => {
                setUsername(res.data.username || '');
                setEmail(res.data.email || '');
                setPhone(res.data.phone || '');
                if (res.data.profile_picture) {
                    setPreviewUrl('http://localhost:8000' + res.data.profile_picture);
                }
            })
            .catch(() => setMessage('Erro ao carregar perfil'));
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setProfilePic(null);
            setPreviewUrl('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('phone', phone);
            if (profile_picture) {
                formData.append('profile_picture', profile_picture);
            }

            await axios.put(PROFILE_URL, formData, {
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            setMessage('Perfil atualizado com sucesso!');
        } catch (error) {
            setMessage('Erro ao atualizar perfil. Tenta novamente.');
        }
    };

    return (
        <div className="create-or-join-wrapper">
            <h2 className="create-or-join-title">Editar Perfil</h2>

            <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        disabled
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>Telemóvel</label>
                    <input
                        type="text"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: +351912345678"
                    />
                </div>

                <div className="form-group">
                    <label>Foto de Perfil</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {(previewUrl) ? (
                    <img
                        className="profile-preview"
                        src={previewUrl}
                        alt="Preview"
                    />
                ) : (
                    <p className="no-photo-text">Sem foto</p>
                )}

                <button type="submit" className="primary-btn">
                    Guardar Alterações
                </button>

                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
};

export default VerEditarPerfil;

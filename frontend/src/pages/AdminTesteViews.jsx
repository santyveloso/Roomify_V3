import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const AdminTesteViews = () => {
    const { houseId } = useParams();

    const [house, setHouse] = useState(null);
    const [members, setMembers] = useState([]);
    const [inviteCode, setInviteCode] = useState('');
    const [newInviteCode, setNewInviteCode] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [houseName, setHouseName] = useState('');
    const [message, setMessage] = useState('');

    const BASE_URL = 'http://localhost:8000/backend';

    // Função para ler o CSRF token do cookie
    const getCSRFToken = () => {
        return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    };



    // Carregar dados da casa e membros
    useEffect(() => {
        const fetchHouse = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/houses/${houseId}/`, { withCredentials: true });
                setHouse(res.data);
                setHouseName(res.data.name);
            } catch (err) {
                setMessage('Erro ao carregar a casa.');
            }
        };

        // const fetchMembers = async () => {
        //     try {
        //         const res = await axios.get(`${BASE_URL}/houses/${houseId}/members/`, { withCredentials: true });
        //         setMembers(res.data);
        //     } catch (err) {
        //         setMessage('Erro ao carregar os membros.');
        //     }
        // };

        fetchHouse();
        // fetchMembers();
    }, [houseId]);

    // Gerar convite
    const generateInvite = async () => {
        setMessage('');
        try {
            const res = await axios.post(
                `${BASE_URL}/houses/${houseId}/invite/`,
                {},
                {
                    withCredentials: true,
                    headers: { 'X-CSRFToken': getCSRFToken() },
                }
            );
            setNewInviteCode(res.data.code);
            setMessage('Convite gerado com sucesso.');
        } catch (err) {
            setMessage('Erro ao gerar convite.');
        }
    };

    // Remover membro
    const removeMember = async (userId) => {
        setMessage('');
        try {
            await axios.delete(`${BASE_URL}/houses/${houseId}/members/${userId}/remove/`, {
                withCredentials: true,
                headers: { 'X-CSRFToken': getCSRFToken() },
            });
            setMembers(members.filter(m => m.id !== userId));
            setMessage('Membro removido com sucesso.');
        } catch (err) {
            setMessage('Erro ao remover membro.');
        }
    };

    // Guardar edição da casa (nome)
    const saveHouseEdit = async () => {
        setMessage('');
        try {
            const res = await axios.put(
                `${BASE_URL}/houses/${houseId}/`,
                { name: houseName },
                {
                    withCredentials: true,
                    headers: { 'X-CSRFToken': getCSRFToken() },
                }
            );
            setHouse(res.data);
            setEditMode(false);
            setMessage('Casa atualizada com sucesso.');
        } catch (err) {
            setMessage('Erro ao atualizar a casa.');
        }
    };

    if (!house) return <div>Carregando...</div>;

    return (
        <div>
            <h1>Detalhes da Casa</h1>

            {editMode ? (
                <div>
                    <input
                        type="text"
                        value={houseName}
                        onChange={e => setHouseName(e.target.value)}
                    />
                    <button onClick={saveHouseEdit}>Guardar</button>
                    <button onClick={() => setEditMode(false)}>Cancelar</button>
                </div>
            ) : (
                <div>
                    <h2>{house.name}</h2>
                    <button onClick={() => setEditMode(true)}>Editar Nome</button>
                </div>
            )}

            <hr />

            <div>
                <h3>Membros</h3>
                <ul>
                    {members.map(member => (
                        <li key={member.id}>
                            {member.username} ({member.email})
                            <button onClick={() => removeMember(member.id)}>Remover</button>
                        </li>
                    ))}
                </ul>
            </div>

            <hr />

            <div>
                <h3>Gerar Convite</h3>
                <button onClick={generateInvite}>Gerar Código</button>
                {newInviteCode && (
                    <p>
                        Código do convite: <strong>{newInviteCode}</strong>
                    </p>
                )}
            </div>

            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminTesteViews;

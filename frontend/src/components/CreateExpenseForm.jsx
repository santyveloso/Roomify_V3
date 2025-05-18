import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateExpenseForm = ({ houseId, onExpenseCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        amount: '',
        date: '',
        created_at: '',
        description: '',
    });
    const [divisionMode, setDivisionMode] = useState('igual'); // 'igual' ou 'personalizado'
    const [roomies, setRoomies] = useState([]);
    const [selectedRoomies, setSelectedRoomies] = useState([]);
    const [customShares, setCustomShares] = useState({}); // {userId: amount}
    //const [houseId, setHouseId] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    const BASE_URL = `http://localhost:8000/backend/houses/${houseId}/expenses/`;
    const BASE_URL_MEMBERS = `http://localhost:8000/backend/houses/${houseId}/members/`;
    //const BASE_URL_SALDO = `http://localhost:8000/backend/houses/${houseId}/expenses/`

    function getCSRFToken() {
        return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    }



    // // Busca user para obter houseId
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const res = await axios.get('http://localhost:8000/backend/users/me/', {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //             const casa = res.data.house?.id || res.data.house_id;
    //             if (casa) setHouseId(casa);
    //             else setMessage('Não foi possível identificar a casa atual.');
    //         } catch {
    //             setMessage('Erro ao carregar utilizador.');
    //         }
    //     };
    //     fetchUser();
    // }, [token]);

    // Busca roomies da casa para selecionar
    useEffect(() => {
        axios.get(BASE_URL_MEMBERS, { withCredentials: true })
            .then(res => setRoomies(res.data))
            .catch(() => setMessage('Erro ao carregar membros da casa.'));
    }, [houseId]);



    // Handle mudanças nos inputs do formulário
    const handleFormChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Toggle seleção de roomies
    const handleRoomieToggle = (id) => {
        if (selectedRoomies.includes(id)) {
            setSelectedRoomies(selectedRoomies.filter(uid => uid !== id));
            const updated = { ...customShares };
            delete updated[id];
            setCustomShares(updated);
        } else {
            setSelectedRoomies([...selectedRoomies, id]);
            if (divisionMode === 'personalizado') {
                setCustomShares({ ...customShares, [id]: '' });
            }
        }
    };

    // Alterar valor personalizado de roomie
    const handleCustomAmountChange = (id, value) => {
        setCustomShares({ ...customShares, [id]: value });
    };

    // Alterar modo divisão (igual ou personalizado)
    const handleDivisionModeChange = (mode) => {
        setDivisionMode(mode);
        if (mode === 'igual') {
            setCustomShares({});
        } else {
            // Para roomies já selecionados, inicializa shares se não existirem
            const newShares = {};
            selectedRoomies.forEach(id => {
                newShares[id] = customShares[id] || '';
            });
            setCustomShares(newShares);
        }
    };

    // Submit do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Valida campos obrigatórios
        if (!formData.title || !formData.amount || !formData.date) {
            setMessage('Preencha todos os campos obrigatórios.');
            return;
        }
        if (selectedRoomies.length === 0) {
            setMessage('Selecione pelo menos um roomie.');
            return;
        }

        const total = parseFloat(formData.amount);
        if (isNaN(total) || total <= 0) {
            setMessage('Valor total inválido.');
            return;
        }

        let assigned_roomies = [];

        if (divisionMode === 'igual') {
            const shareValue = parseFloat((total / selectedRoomies.length).toFixed(2));
            assigned_roomies = selectedRoomies.map(uid => ({ user: uid, amount_due: shareValue }));

            // Calcular soma atual
            const somaAtual = shareValue * selectedRoomies.length;
            const diferenca = parseFloat((total - somaAtual).toFixed(2));

            // Ajustar o último roomie para corrigir diferença
            assigned_roomies[assigned_roomies.length - 1].amount_due = parseFloat(
                (assigned_roomies[assigned_roomies.length - 1].amount_due + diferenca).toFixed(2)
            );
        } else {
            // divisão personalizada
            let somaShares = 0;
            for (const uid of selectedRoomies) {
                const val = parseFloat(customShares[uid]);
                if (isNaN(val) || val < 0) {
                    setMessage('Valores inválidos na divisão personalizada.');
                    return;
                }
                somaShares += val;
                assigned_roomies.push({ user: uid, amount_due: val });
            }
            // Comparar soma com total (permitir pequeno erro de arredondamento)
            if (Math.abs(somaShares - total) > 0.01) {
                setMessage('A soma dos valores personalizados não bate com o total.');
                return;
            }
        }

        const payload = {
            ...formData,
            house: houseId,
            assigned_roomies,
        };

        try {
            await axios.post(BASE_URL, payload, {
                headers: { 'X-CSRFToken': getCSRFToken() },
                withCredentials: true,
            });

            setMessage('Despesa criada com sucesso!');

            //navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setMessage('Erro ao criar despesa.' + JSON.stringify(payload));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="post-wrapper expense-form-wrapper">
            <h2 className="create-home-title">Criar Nova Despesa</h2>

            {/* Botão Voltar */}
            <button
                type="button"
                className="primary-btn"
                style={{
                    backgroundColor: '#f2f2f2',
                    color: '#333',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1rem'
                }}
                onClick={() => navigate(-1)}
            >
                ← Voltar
            </button>

            <input
                name="title"
                placeholder="Título"
                value={formData.title}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded"
            />

            <div>
                <label>Categoria</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    className="w-full p-2 border rounded"
                >
                    <option value="">Selecione uma categoria</option>
                    <option value="comida">Comida</option>
                    <option value="agua">Água</option>
                    <option value="luz">Luz</option>
                    <option value="gas">Gás</option>
                    <option value="outros">Outros</option>
                </select>
            </div>


            <input
                name="amount"
                type="number"
                step="0.01"
                placeholder="Valor (€)"
                value={formData.amount}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded"
            />

            <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded"
            />

            <textarea
                name="description"
                placeholder="Descrição"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
            />

            <div className="radio-group" style={{ marginTop: '1rem' }}>
                <label className="radio-option">
                    <input
                        type="radio"
                        checked={divisionMode === 'igual'}
                        onChange={() => handleDivisionModeChange('igual')}
                    />
                    Igual
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        checked={divisionMode === 'personalizado'}
                        onChange={() => handleDivisionModeChange('personalizado')}
                    />
                    Personalizada
                </label>
            </div>

            <div className="checkbox-list">
                <p className="font-medium mb-2">Seleciona os Roomies:</p>
                {roomies.length === 0 && <p>Nenhum roomie encontrado.</p>}
                {roomies.map(roomie => (
                    <label key={roomie.id} className="checkbox-option">
                        <input
                            type="checkbox"
                            checked={selectedRoomies.includes(roomie.id)}
                            onChange={() => handleRoomieToggle(roomie.id)}
                        />
                        {roomie.username}
                        {divisionMode === 'personalizado' && selectedRoomies.includes(roomie.id) && (
                            <input
                                type="number"
                                step="0.01"
                                placeholder="€"
                                className="w-24 p-1 border rounded"
                                value={customShares[roomie.id] || ''}
                                onChange={e => handleCustomAmountChange(roomie.id, e.target.value)}
                                required
                            />
                        )}
                    </label>
                ))}
            </div>

            <div className="expense-btn-center">
                <button type="submit" className="primary-btn expense-btn-large">
                    Criar Despesa
                </button>
            </div>

            {message && <p className="form-message">{message}</p>}
        </form>
    );
};

export default CreateExpenseForm;

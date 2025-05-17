// import React, { useState } from 'react';
// import axios from 'axios';



// // ver isto so pus pra n me esquecer da logica

// function CreateExpenseForm({ houseId, roomies }) { //todos os roomies da casa
//     const [title, setTitle] = useState('');
//     const [category, setCategory] = useState('');
//     const [amount, setAmount] = useState('');
//     const [date, setDate] = useState('');
//     const [description, setDescription] = useState('');
//     const [divisionMode, setDivisionMode] = useState('igual'); // 'igual' ou 'personalizado' (divisao pelos roomies)
//     const [selectedRoomies, setSelectedRoomies] = useState([]);
//     const [customShares, setCustomShares] = useState({}); // JSON {userId: valor} para divisão personalizada



//     const handleRoomieToggle = (id) => {
//         if (selectedRoomies.includes(id)) {
//             setSelectedRoomies(selectedRoomies.filter(uid => uid !== id));
//             const updated = { ...customShares };
//             delete updated[id];
//             setCustomShares(updated);
//         } else {
//             setSelectedRoomies([...selectedRoomies, id]);
//             if (divisionMode === 'personalizado') {
//                 setCustomShares({ ...customShares, [id]: '' });
//             }
//         }
//     };

//     //Alterar valor de um Roomie (modo personalizado)
//     const handleCustomAmountChange = (id, value) => {
//         setCustomShares({ ...customShares, [id]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!title || !amount || !date || selectedRoomies.length === 0) {
//             alert("Preenche todos os campos obrigatórios.");
//             return;
//         }

//         const total = parseFloat(amount); // valor total da despesa
//         let assigned_roomies = []; // o arry dos roomies q vai ser enviado pro backend



//         // SE FOR PRA DIVIDIR IGUAL
//         if (divisionMode === 'igual') {
//             const shareValue = parseFloat((total / selectedRoomies.length).toFixed(2));
//             assigned_roomies = selectedRoomies.map(uid => ({ user: uid, amount_due: shareValue })); // roomies com valores iguais associados

//             // SE FOR DIVISAO PERSONALIZADA
//         } else {
//             let totalCustom = 0;
//             for (const roomie of selectedRoomies) { // para cada roomie vai buscar o valor introduzido
//                 const val = parseFloat(customShares[roomie]);
//                 if (isNaN(val)) {
//                     alert("Valores inválidos na divisão personalizada.");
//                     return;
//                 }
//                 totalCustom += val; // total vai sendo adicionado pra comparar no fim
//                 assigned_roomies.push({ user: roomie, amount_due: val }); // mete no array q vai ser enviado JSON
//             }

//             if (totalCustom !== total) {
//                 alert("A soma dos valores personalizados não bate certo com o total.");
//                 return;
//             }
//         }

//         const payload = {
//             house: houseId,
//             title,
//             category,
//             amount: total,
//             date,
//             description,
//             assigned_roomies: assigned_roomies,
//         };

//         try {
//             await axios.post('/backend/expenses/', payload, { withCredentials: true });
//             alert("Despesa criada com sucesso!");
//         } catch (err) {
//             console.error(err);
//             alert("Erro ao criar despesa.");
//         }
//     };



//     return (
//         <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded shadow">
//             <h2 className="text-xl font-semibold">Nova Despesa</h2>

//             <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
//             <input type="text" placeholder="Categoria" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded" />
//             <input type="number" placeholder="Valor (€)" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full p-2 border rounded" />
//             <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border rounded" />
//             <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />

//             <div className="flex gap-4 items-center">
//                 <label>Divisão:</label>
//                 <label><input type="radio" checked={divisionMode === 'equal'} onChange={() => setDivisionMode('equal')} /> Igual</label>
//                 <label><input type="radio" checked={divisionMode === 'custom'} onChange={() => setDivisionMode('custom')} /> Personalizada</label>
//             </div>

//             <div>
//                 <p className="font-medium">Seleciona os Roomies:</p>
//                 {roomies.map(roomie => (
//                     <div key={roomie.id} className="flex items-center gap-2">
//                         <input type="checkbox" checked={selectedRoomies.includes(roomie.id)} onChange={() => handleRoomieToggle(roomie.id)} />
//                         <span>{roomie.username}</span>
//                         {divisionMode === 'custom' && selectedRoomies.includes(roomie.id) && (
//                             <input type="number" step="0.01" placeholder="€" value={customShares[roomie.id] || ''} onChange={e => handleCustomAmountChange(roomie.id, e.target.value)} className="w-24 p-1 border rounded" />
//                         )}
//                     </div>
//                 ))}
//             </div>

//             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Criar Despesa</button>
//         </form>
//     );
// }

// export default CreateExpenseForm;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateExpenseForm = ({ houseId, onTaskCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        amount: '',
        date: '',
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
            setMessage('Erro ao criar despesa.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded shadow max-w-md mx-auto">
            <h2 className="text-xl font-semibold">Criar Nova Despesa</h2>

            <input
                name="title"
                placeholder="Título"
                value={formData.title}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded"
            />

            <input
                name="category"
                placeholder="Categoria"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
            />

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

            <div className="flex gap-4 items-center">
                <label className="font-medium">Divisão:</label>
                <label>
                    <input
                        type="radio"
                        checked={divisionMode === 'igual'}
                        onChange={() => handleDivisionModeChange('igual')}
                    />{' '}
                    Igual
                </label>
                <label>
                    <input
                        type="radio"
                        checked={divisionMode === 'personalizado'}
                        onChange={() => handleDivisionModeChange('personalizado')}
                    />{' '}
                    Personalizada
                </label>
            </div>

            <div>
                <p className="font-medium mb-2">Seleciona os Roomies:</p>
                {roomies.length === 0 && <p>Nenhum roomie encontrado.</p>}
                {roomies.map(roomie => (
                    <div key={roomie.id} className="flex items-center gap-2 mb-1">
                        <input
                            type="checkbox"
                            checked={selectedRoomies.includes(roomie.id)}
                            onChange={() => handleRoomieToggle(roomie.id)}
                        />
                        <span className="flex-1">{roomie.username}</span>

                        {/* Mostrar input só no modo personalizado e se roomie estiver selecionado */}
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
                    </div>
                ))}
            </div>

            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Criar Despesa
            </button>

            {message && <p className="mt-2 text-red-600">{message}</p>}
        </form>
    );
};

export default CreateExpenseForm;

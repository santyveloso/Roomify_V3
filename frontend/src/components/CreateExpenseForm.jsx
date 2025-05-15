import React, { useState } from 'react';
import axios from 'axios';



// ver isto so pus pra n me esquecer da logica

function CreateExpenseForm({ houseId, roomies }) { //todos os roomies da casa
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [divisionMode, setDivisionMode] = useState('igual'); // 'igual' ou 'personalizado' (divisao pelos roomies)
    const [selectedRoomies, setSelectedRoomies] = useState([]);
    const [customShares, setCustomShares] = useState({}); // JSON {userId: valor} para divisão personalizada



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

    //Alterar valor de um Roomie (modo personalizado)
    const handleCustomAmountChange = (id, value) => {
        setCustomShares({ ...customShares, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !amount || !date || selectedRoomies.length === 0) {
            alert("Preenche todos os campos obrigatórios.");
            return;
        }

        const total = parseFloat(amount); // valor total da despesa
        let assigned_roomies = []; // o arry dos roomies q vai ser enviado pro backend



        // SE FOR PRA DIVIDIR IGUAL
        if (divisionMode === 'igual') {
            const shareValue = parseFloat((total / selectedRoomies.length).toFixed(2));
            assigned_roomies = selectedRoomies.map(uid => ({ user: uid, amount_due: shareValue })); // roomies com valores iguais associados

            // SE FOR DIVISAO PERSONALIZADA
        } else {
            let totalCustom = 0;
            for (const roomie of selectedRoomies) { // para cada roomie vai buscar o valor introduzido
                const val = parseFloat(customShares[roomie]);
                if (isNaN(val)) {
                    alert("Valores inválidos na divisão personalizada.");
                    return;
                }
                totalCustom += val; // total vai sendo adicionado pra comparar no fim
                assigned_roomies.push({ user: roomie, amount_due: val }); // mete no array q vai ser enviado JSON
            }

            if (totalCustom !== total) {
                alert("A soma dos valores personalizados não bate certo com o total.");
                return;
            }
        }

        const payload = {
            house: houseId,
            title,
            category,
            amount: total,
            date,
            description,
            assigned_roomies: assigned_roomies,
        };

        try {
            await axios.post('/backend/expenses/', payload, { withCredentials: true });
            alert("Despesa criada com sucesso!");
        } catch (err) {
            console.error(err);
            alert("Erro ao criar despesa.");
        }
    };



    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded shadow">
            <h2 className="text-xl font-semibold">Nova Despesa</h2>

            <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="text" placeholder="Categoria" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded" />
            <input type="number" placeholder="Valor (€)" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border rounded" />
            <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />

            <div className="flex gap-4 items-center">
                <label>Divisão:</label>
                <label><input type="radio" checked={divisionMode === 'equal'} onChange={() => setDivisionMode('equal')} /> Igual</label>
                <label><input type="radio" checked={divisionMode === 'custom'} onChange={() => setDivisionMode('custom')} /> Personalizada</label>
            </div>

            <div>
                <p className="font-medium">Seleciona os Roomies:</p>
                {roomies.map(roomie => (
                    <div key={roomie.id} className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedRoomies.includes(roomie.id)} onChange={() => handleRoomieToggle(roomie.id)} />
                        <span>{roomie.username}</span>
                        {divisionMode === 'custom' && selectedRoomies.includes(roomie.id) && (
                            <input type="number" step="0.01" placeholder="€" value={customShares[roomie.id] || ''} onChange={e => handleCustomAmountChange(roomie.id, e.target.value)} className="w-24 p-1 border rounded" />
                        )}
                    </div>
                ))}
            </div>

            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Criar Despesa</button>
        </form>
    );
}

export default CreateExpenseForm;
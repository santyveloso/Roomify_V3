import React from 'react';
import boneco from '../images/boneco.jpg'; 

function Ups() {
  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <img src={boneco} alt="Erro" width="200" />
        <h1>Ups, algo deu errado.</h1>
        <p>Tente novamente mais tarde.</p>
      </div>
    </div>
  );
}
export default Ups;

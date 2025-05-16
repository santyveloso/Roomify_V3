import React from 'react';

const FuncComp = () => {
  return (
    <div className="create-or-join-wrapper">
      <h1 className="create-or-join-title">Funcionalidades do RoomiFy</h1>

      <div className="house-switcher">
        <div className="form-container">
          <p>
            O <strong>RoomiFy</strong> foi criado para simplificar a vida em casas partilhadas. Estas são algumas das funcionalidades principais que irão facilitar a tua organização e convivência com os teus roomies:
          </p>

          <h3>🏠 Gestão de Casas</h3>
          <p>Cria uma casa, convida membros e gere facilmente os detalhes do teu lar partilhado.</p>

          <h3>🗓️ Criação e Atribuição de Tarefas</h3>
          <p>Define tarefas domésticas, atribui responsáveis e acompanha o progresso. Todos sabem o que fazer e quando fazer.</p>

          <h3>💸 Gestão de Despesas</h3>
          <p>Regista despesas comuns, divide os custos entre roomies e acompanha quem já pagou e quem ainda tem valores em aberto.</p>

          <h3>👥 Perfil de Utilizador</h3>
          <p>Cada utilizador tem um perfil com dados pessoais, tipo de utilizador (admin ou roomie) e uma foto personalizada.</p>

          <h3>🔗 Convites por Código</h3>
          <p>Partilha códigos de convite para que novos roomies se juntem à casa de forma simples e segura.</p>

          <h3>📊 Dashboard Personalizado</h3>
          <p>Administração e roomies têm dashboards adaptados às suas funcionalidades e responsabilidades.</p>
          
          <hr style={{ margin: '1.5rem 0' }} />

          <p>
            Estamos sempre a trabalhar em novas funcionalidades para tornar o RoomiFy ainda mais completo. Tens uma sugestão? Entra em contacto com a equipa de suporte!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FuncComp;

import React from 'react';

const SuporteComp = () => {
  return (
    <div className="create-or-join-wrapper">
      <h1 className="create-or-join-title">Precisas de Ajuda?</h1>

      <div className="house-switcher">
        <div className="form-container">
          <p>
            Estamos aqui para te ajudar a tirar o máximo proveito do <strong>RoomiFy</strong>!<br />
            Se tiveres dúvidas, problemas técnicos ou sugestões, não hesites em contactar-nos.
          </p>

          <p><strong>📬 Email de Suporte:</strong> support@roomify.pt</p>
          <p><strong>📞 Linha Direta:</strong> +351 920 136 576</p>
          <p><strong>🕐 Horário de Atendimento:</strong> Dias úteis das 9h às 18h</p>

          <hr style={{ margin: '1.5rem 0' }} />

          <h3>Perguntas Frequentes</h3>

          <p><strong>• Como entro numa casa com código?</strong><br />
          Regista-te, faz Login e insere o código de convite que recebeste.</p>

          <p><strong>• Esqueci-me da minha password. E agora?</strong><br />
          Entra em contacto connosco por email e ajudamos-te a recuperar o acesso.</p>

          <p><strong>• Posso sair de uma casa e entrar noutra?</strong><br />
          Sim! Pede ao administrador para te remover ou contacta o suporte para te ajudarmos.</p>

          <hr style={{ margin: '1.5rem 0' }} />

        </div>
      </div>
    </div>
  );
};

export default SuporteComp;

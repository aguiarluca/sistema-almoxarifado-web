# Sistema de Requisição e Gestão de Almoxarifado

Solução Full Stack desenvolvida para digitalizar e organizar o fluxo de suprimentos, eliminando falhas de comunicação e estabelecendo controle total sobre o inventário.

## O Desafio (Business Case)
O setor operava com **zero controle de estoque** e processos manuais (mensagens/ligações), resultando em:
* Erros frequentes na separação e expedição.
* Impossibilidade de rastrear custos e consumo por usuário/setor.
* Elevado índice de perdas e falta de previsão para compras.

## Tecnologias Utilizadas
* **Back-end:** Google Apps Script (JavaScript) para lógica de servidor e integração de dados.
* **Front-end:** HTML5, CSS3 e JavaScript para uma interface responsiva.
* **Banco de Dados:** Google Sheets (Solução de baixo custo e alta eficiência).

## Funcionalidades Principais
* **Rastreabilidade com ID Único:** Geração de um identificador exclusivo para cada pedido, garantindo integridade no histórico de requisições.
* **Automação de Notificações:** Envio automático de confirmação para o e-mail cadastrado do usuário no momento da solicitação.
* **Protocolo de Recebimento:** Geração de formulário digital para assinatura no ato da entrega, formalizando a custódia do item.
* **Arquitetura de Contingência (Backup):** Sistema de backup automatizado no Google Drive para armazenamento dos documentos gerados, garantindo a disponibilidade da informação em caso de falhas no envio de e-mail.
* **Gestão de Inventário:** Fluxo completo de entradas, saídas e inventários cíclicos com cálculo de custo médio.

## Resultados Alcançados
* **Redução de Estoque:** Otimização do capital imobilizado e eliminação de perdas operacionais.
* **Gestão de Custos:** Visibilidade total dos usuários e setores que geram maiores despesas.
* **Eficiência Operacional:** Estancamento de falhas na separação e formalização 100% digital dos processos.

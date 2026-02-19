/**
 * SISTEMA DE GESTÃO DE ALMOXARIFADO - BACK-END
 * Desenvolvido por Lucas Aguiar
 * * Este script gerencia a integração entre a interface Web, Google Sheets e Google Drive.
 */

// CONFIGURAÇÃO: Substitua pelo ID da sua planilha para testes locais
const SPREADSHEET_ID = '************************';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Sistema RUES - Gestão de Almoxarifado')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Recupera itens com saldo em estoque positivo.
 * Demonstra lógica de cruzamento de tabelas (Estoque x Cadastro de Itens).
 */
function getItensComEstoque() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Mapeamento de Saldos (Aba Estoque)
  const abaEstoque = ss.getSheetByName('Estoque');
  const dadosEstoque = abaEstoque.getRange(2, 1, abaEstoque.getLastRow() - 1, 8).getValues();
  const mapaEstoque = {};
  
  dadosEstoque.forEach(linha => {
    const codItem = linha[0]; 
    const estAtual = linha[7]; 
    if (codItem) {
      mapaEstoque[codItem.toString().trim()] = estAtual;
    }
  });

  // Cruzamento com Cadastro de Itens
  const abaItens = ss.getSheetByName('Itens');
  const dadosItens = abaItens.getRange(2, 1, abaItens.getLastRow() - 1, 7).getValues();
  
  return dadosItens.map(itemInfo => {
    const codItem = itemInfo[4];
    const estoque = mapaEstoque[codItem.toString().trim()];
    
    return {
      categoria: itemInfo[0],
      setor: itemInfo[1],
      itemDesc: itemInfo[2],
      imagem: itemInfo[3],
      cod_item: codItem,
      custo: itemInfo[5],
      gramatura: itemInfo[6],
      estoque: (estoque != null) ? Number(estoque) : 0 
    };
  });
}

/**
 * Registra o pedido, gera PDF de protocolo e gerencia contingência de e-mail.
 */
function registrarPedido(obj) {
  let statusEmail = "Envio com sucesso";
  let numeroPedido;

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const abaRespostas = ss.getSheetByName('Respostas');
    const ultimaLinha = abaRespostas.getLastRow();
    
    // Geração de ID Único de Pedido
    numeroPedido = `P${Utilities.formatDate(new Date(), 'GMT-3', 'yyyyMMdd')}-${ultimaLinha + 1}`;
    
    const abaLojas = ss.getSheetByName('Lojas');
    const dadosLojas = abaLojas.getRange(2, 1, abaLojas.getLastRow() - 1, 5).getValues();
    const lojaInfo = dadosLojas.find(l => String(l[1]).trim() === String(obj.loja).trim());
    const nomeCompletoDaLoja = lojaInfo ? lojaInfo[0] : obj.loja;

    // Geração do PDF de Protocolo
    const infoParaPdf = { ...obj, pedidoNum: numeroPedido, lojaNome: nomeCompletoDaLoja };
    const pdfBlob = gerarPdfPedido(infoParaPdf);

    // Persistência em Drive (Backup de Segurança)
    const pastaDestino = getOrCreateFolder("Pedidos PDF Backup");
    pdfBlob.setName(`PEDIDO_${numeroPedido}.pdf`); 
    pastaDestino.createFile(pdfBlob);

    // Disparo de Automação de E-mail
    try {
      enviarEmail(obj, numeroPedido, pdfBlob, nomeCompletoDaLoja);
    } catch (emailError) {
      statusEmail = `Falha no envio (Backup salvo no Drive): ${emailError.message}`;
    }

    // Gravação dos dados no Banco (Sheets)
    const dataHora = new Date();
    obj.itens.forEach(item => {
      abaRespostas.appendRow([
        dataHora, obj.nome, obj.cpf, obj.loja,
        item.categoria, item.setor, item.cod_item, item.item,
        item.gramatura, item.qtd, item.custo, item.custo_total,
        numeroPedido, obj.finalidade || '',
        statusEmail
      ]);
    });
    
    return { sucesso: true, numeroPedido: numeroPedido, statusEmail: statusEmail };

  } catch (e) {
    throw new Error(`Erro no processamento: ${e.message}`);
  }
}

// ... (Funções auxiliares como getLojas, calcularPrevisaoEntrega e gerarPdfPedido permanecem com a lógica original)

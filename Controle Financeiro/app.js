const form = document.getElementById('finance-form');
const transactionList = document.getElementById('transaction-list');
const totalReceitasEl = document.getElementById('total-receitas');
const totalDespesasEl = document.getElementById('total-despesas');
const saldoFinalEl = document.getElementById('saldo-final');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentEditIndex = null; // Índice da transação em edição

// Atualiza o resumo financeiro
function updateSummary() {
    const receitas = transactions.filter(t => t.categoria === 'Receitas').reduce((acc, t) => acc + t.valor, 0);
    const despesas = transactions.filter(t => t.categoria === 'Despesas').reduce((acc, t) => acc + t.valor, 0);
    const saldo = receitas - despesas;

    totalReceitasEl.textContent = `R$ ${receitas.toFixed(2)}`;
    totalDespesasEl.textContent = `R$ ${despesas.toFixed(2)}`;
    saldoFinalEl.textContent = `R$ ${saldo.toFixed(2)}`;

    saldoFinalEl.classList.remove('positivo', 'negativo');
    saldoFinalEl.classList.add(saldo >= 0 ? 'positivo' : 'negativo');
}

// Renderiza a lista de transações
function renderTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach((t, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.descricao}</td>
            <td>${t.categoria}</td>
            <td>${t.data}</td>
            <td>R$ ${t.valor.toFixed(2)}</td>
            <td class="actions">
                <button onclick="editTransaction(${index})">Editar</button>
                <button onclick="deleteTransaction(${index})">Excluir</button>
            </td>
        `;
        transactionList.appendChild(row);
    });
    updateSummary();
}

// Adiciona ou edita uma transação
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const descricao = document.getElementById('descricao').value;
    const categoria = document.getElementById('categoria').value;
    const data = document.getElementById('data').value;
    const valor = parseFloat(document.getElementById('valor').value);

    if (currentEditIndex === null) {
        // Nova transação
        const newTransaction = { descricao, categoria, data, valor };
        transactions.push(newTransaction);
    } else {
        // Atualizar transação existente
        transactions[currentEditIndex] = { descricao, categoria, data, valor };
        currentEditIndex = null; // Reseta o índice de edição
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    form.reset();
    form.querySelector('button').textContent = 'Salvar'; // Voltar botão ao padrão
});

// Editar uma transação
function editTransaction(index) {
    const transaction = transactions[index];

    document.getElementById('descricao').value = transaction.descricao;
    document.getElementById('categoria').value = transaction.categoria;
    document.getElementById('data').value = transaction.data;
    document.getElementById('valor').value = transaction.valor;

    currentEditIndex = index; // Define a transação a ser editada
    form.querySelector('button').textContent = 'Atualizar'; // Altera o texto do botão
}

// Exclui uma transação
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
}

// Inicializa o app
renderTransactions();

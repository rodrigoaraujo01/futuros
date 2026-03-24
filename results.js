// ============================================================
// results.js — Dashboard de resultados
// ============================================================

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const colorClasses = { 1: 'color-blue', 2: 'color-orange', 3: 'color-green', 4: 'color-gray' };

const questions = {
  1: {
    title: 'Qual será a habilidade mais importante para o profissional do futuro?',
    theme: 'Profissional do Futuro',
    options: {
      a: 'Criatividade',
      b: 'Resiliência',
      c: 'Empreendedorismo',
      d: 'Pensamento estratégico',
      e: 'Liderança',
    },
  },
  2: {
    title: 'Em 2040, quantos % do portfólio da Petrobras será referente a óleo e gás?',
    theme: 'Transição Energética',
    options: {
      a: '10%',
      b: '30%',
      c: '50%',
      d: '70%',
      e: '90%',
    },
  },
  3: {
    title: 'Qual prática de IA responsável terá maior impacto positivo na sociedade?',
    theme: 'IA Responsável',
    options: {
      a: 'Transparência e explicabilidade dos algoritmos',
      b: 'Redução e mitigação de vieses em sistemas de IA',
      c: 'Regulamentação e governança de IA',
      d: 'Avaliação de riscos de IA',
      e: 'Avaliação de confiabilidade de sistemas de IA',
    },
  },
  4: {
    title: 'Qual será o papel mais transformador da IA na governança de dados?',
    theme: 'Governança de Dados',
    options: {
      a: 'Agentes de IA como curadores',
      b: 'IA criando políticas e padrões',
      c: 'Monitoramento em tempo real',
      d: 'IA garantindo uso ético',
      e: 'Governança como rede assessorada por IA',
    },
  },
};


async function loadResults() {
  const container = document.getElementById('results');

  const { data, error } = await supabaseClient
    .from('responses')
    .select('question_number, answer');

  if (error) {
    container.innerHTML = '<p style="text-align:center; color:#c00;">Erro ao carregar resultados.</p>';
    console.error(error);
    return;
  }

  // Agregar votos
  const counts = {};
  for (let q = 1; q <= 4; q++) {
    counts[q] = { a: 0, b: 0, c: 0, d: 0, e: 0, total: 0 };
  }

  for (const row of data) {
    const q = row.question_number;
    const a = row.answer;
    if (counts[q] && counts[q][a] !== undefined) {
      counts[q][a]++;
      counts[q].total++;
    }
  }

  // Renderizar
  let html = '';
  for (let q = 1; q <= 4; q++) {
    const question = questions[q];
    const qCounts = counts[q];

    html += `<div class="result-card ${colorClasses[q]}">`;
    html += `<div class="card-sidebar"><span class="badge sidebar-badge">${question.theme}</span></div>`;
    html += `<div class="card-content">`;
    html += `<h3>${question.title}</h3>`;

    const sorted = ['a', 'b', 'c', 'd', 'e'].sort((x, y) => qCounts[y] - qCounts[x]);
    for (const letter of sorted) {
      const count = qCounts[letter];
      const pct = qCounts.total > 0 ? Math.round((count / qCounts.total) * 100) : 0;

      html += `
        <div class="bar-row">
          <span class="bar-label">${question.options[letter]}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%"></div>
          </div>
          <span class="bar-value">${pct}%</span>
        </div>`;
    }

    html += `<div class="total-votes">${qCounts.total} voto${qCounts.total !== 1 ? 's' : ''}</div>`;
    html += `</div>`;
    html += `</div>`;
  }

  container.innerHTML = html;
}

// Carregar ao abrir
loadResults();

// Auto-refresh a cada 10 segundos
setInterval(loadResults, 10000);

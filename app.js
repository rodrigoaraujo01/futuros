// ============================================================
// app.js — Lógica do quiz
// ============================================================

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const answers = {};
const totalQuestions = 4;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight; // trigger reflow
    target.style.animation = '';
  }
}

function startQuiz() {
  showScreen('q1');
}

function retry() {
  showScreen('q1');
}

// Lidar com clique em opção
document.querySelectorAll('.option').forEach(btn => {
  btn.addEventListener('click', async () => {
    const q = parseInt(btn.dataset.q);
    const a = btn.dataset.a;

    // Marcar opção selecionada
    btn.closest('.options').querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    answers[q] = a;

    // Pequeno delay antes de avançar
    await new Promise(r => setTimeout(r, 350));

    if (q < totalQuestions) {
      showScreen('q' + (q + 1));
    } else {
      await submitAnswers();
    }
  });
});

async function submitAnswers() {
  showScreen('thanks');
  document.getElementById('thanks').classList.add('loading');

  const rows = Object.entries(answers).map(([question_number, answer]) => ({
    question_number: parseInt(question_number),
    answer,
  }));

  const { error } = await supabaseClient.from('responses').insert(rows);

  document.getElementById('thanks').classList.remove('loading');

  if (error) {
    console.error('Erro ao enviar:', error);
    showScreen('error');
    return;
  }

  showScreen('thanks');
}

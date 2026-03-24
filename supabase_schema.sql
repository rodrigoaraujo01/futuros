-- Tabela de respostas
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_number SMALLINT NOT NULL CHECK (question_number BETWEEN 1 AND 4),
  answer CHAR(1) NOT NULL CHECK (answer IN ('a', 'b', 'c', 'd', 'e')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para consultas de agregação por pergunta
CREATE INDEX idx_responses_question ON responses (question_number);

-- Habilitar RLS
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT anônimo (qualquer participante pode votar)
CREATE POLICY "Allow anonymous insert"
  ON responses FOR INSERT
  TO anon
  WITH CHECK (true);

-- Permitir SELECT anônimo (para exibir resultados)
CREATE POLICY "Allow anonymous select"
  ON responses FOR SELECT
  TO anon
  USING (true);

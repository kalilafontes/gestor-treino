import { Link, Navigate, useParams } from 'react-router-dom';
import { ErrorState, PageLoader } from '@/components/feedback/status';
import { useTeacherPlans } from '../hooks/use-training';
import { useState } from 'react';
import { InlineAlert } from '@/components/feedback/status';

const planExercises = [
  { name: 'Agachamento livre', prescription: '4 séries de 10 repetições' },
  { name: 'Supino reto', prescription: '4 séries de 8 repetições' },
  { name: 'Remada articulada', prescription: '3 séries de 12 repetições' },
  { name: 'Desenvolvimento com halteres', prescription: '3 séries de 10 repetições' },
  { name: 'Elevação lateral', prescription: '3 séries de 12 repetições' },
  { name: 'Prancha frontal', prescription: '3 séries de 40 segundos' },
  { name: 'Alongamento', prescription: '8 minutos' },
] as const;

export function TeacherPlanDetailPage() {
  const { planId } = useParams();
  const plans = useTeacherPlans();
  const [assigning, setAssigning] = useState(false);
  const [assigned, setAssigned] = useState<string[]>(['Ana Aluna', 'Bruno Santos', 'Carla Lima']);
  const [selectedStudent, setSelectedStudent] = useState('Diego Costa');
  const [showAll, setShowAll] = useState(false);
  const [exerciseDetail, setExerciseDetail] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  if (plans.isLoading) return <PageLoader label="Abrindo o plano" />;
  if (plans.isError) return <ErrorState retry={() => void plans.refetch()} />;
  const plan = plans.data?.find((item) => item.id === planId);
  if (!plan) return <Navigate to="/app/planos" replace />;

  return (
    <section className="dashboard-page detail-page">
      <Link className="back-link" to="/app/planos">
        ← Voltar para planos
      </Link>
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Plano ativo</p>
          <h1>{plan.title}</h1>
          <p>
            {plan.exercises} exercícios · {plan.students} alunos · {plan.updatedAt}
          </p>
        </div>
        <button className="button button-primary" onClick={() => setAssigning(true)}>
          Atribuir a um aluno
        </button>
      </div>

      {notice && <InlineAlert kind="success">{notice}</InlineAlert>}
      {assigning && (
        <section className="action-panel" aria-labelledby="assign-title">
          <div>
            <p className="eyebrow">Nova atribuição</p>
            <h2 id="assign-title">Escolha um aluno</h2>
          </div>
          <label>
            Aluno
            <select
              value={selectedStudent}
              onChange={(event) => setSelectedStudent(event.target.value)}
            >
              <option>Diego Costa</option>
              <option>Elisa Souza</option>
              <option>Fernando Alves</option>
            </select>
          </label>
          <div className="action-buttons">
            <button
              className="button button-primary"
              onClick={() => {
                setAssigned((current) =>
                  current.includes(selectedStudent) ? current : [...current, selectedStudent],
                );
                setNotice(`${selectedStudent} recebeu o plano com sucesso.`);
                setAssigning(false);
              }}
            >
              Confirmar atribuição
            </button>
            <button className="button button-quiet" onClick={() => setAssigning(false)}>
              Cancelar
            </button>
          </div>
        </section>
      )}

      <div className="detail-columns">
        <section aria-labelledby="exercise-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Estrutura</p>
              <h2 id="exercise-title">Exercícios do plano</h2>
            </div>
          </div>
          <ol className="compact-exercise-list">
            {planExercises.slice(0, plan.exercises).map((exercise) => (
              <li key={exercise.name}>
                <div>
                  <strong>{exercise.name}</strong>
                  <span>{exercise.prescription}</span>
                </div>
                <button
                  className="button button-quiet"
                  aria-expanded={exerciseDetail === exercise.name}
                  onClick={() =>
                    setExerciseDetail((current) =>
                      current === exercise.name ? null : exercise.name,
                    )
                  }
                >
                  {exerciseDetail === exercise.name ? 'Fechar' : 'Detalhes'}
                </button>
                {exerciseDetail === exercise.name && (
                  <p className="exercise-note">
                    Descanso recomendado de 60–90 segundos. Priorize amplitude controlada.
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <aside className="student-panel" aria-labelledby="student-title">
          <p className="eyebrow">Atribuições</p>
          <h2 id="student-title">Alunos neste plano</h2>
          {assigned.slice(0, showAll ? assigned.length : 3).map((student) => (
            <div className="assigned-student" key={student}>
              <span aria-hidden="true">{student.charAt(0)}</span>
              <strong>{student}</strong>
            </div>
          ))}
          <button
            className="button button-quiet button-full"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? 'Mostrar menos' : 'Gerenciar atribuições'}
          </button>
        </aside>
      </div>
    </section>
  );
}

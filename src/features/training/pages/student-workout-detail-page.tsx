import { Link, Navigate, useParams } from 'react-router-dom';
import { ErrorState, PageLoader } from '@/components/feedback/status';
import { useStudentWorkouts } from '../hooks/use-training';
import { useState } from 'react';
import { InlineAlert } from '@/components/feedback/status';

const exercises = [
  { name: 'Agachamento livre', sets: '4 × 10', rest: '90 s', load: 'Moderada' },
  { name: 'Supino reto', sets: '4 × 8', rest: '90 s', load: 'Moderada' },
  { name: 'Remada baixa', sets: '3 × 12', rest: '60 s', load: 'Confortável' },
  { name: 'Desenvolvimento', sets: '3 × 10', rest: '60 s', load: 'Leve' },
  { name: 'Prancha', sets: '3 × 40 s', rest: '45 s', load: 'Corporal' },
  { name: 'Alongamento guiado', sets: '1 × 8 min', rest: '—', load: 'Corporal' },
] as const;

export function StudentWorkoutDetailPage() {
  const { workoutId } = useParams();
  const workouts = useStudentWorkouts();
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  if (workouts.isLoading) return <PageLoader label="Abrindo seu treino" />;
  if (workouts.isError) return <ErrorState retry={() => void workouts.refetch()} />;
  const workout = workouts.data?.find((item) => item.id === workoutId);
  if (!workout) return <Navigate to="/app/treinos" replace />;

  return (
    <section className="dashboard-page detail-page">
      <Link className="back-link" to="/app/treinos">
        ← Voltar para treinos
      </Link>
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">{workout.status}</p>
          <h1>{workout.title}</h1>
          <p>
            {workout.frequency} · {workout.duration} · com {workout.coach}
          </p>
        </div>
        {!started ? (
          <button
            className="button button-primary"
            onClick={() => {
              setStarted(true);
              setFinished(false);
            }}
          >
            Iniciar treino
          </button>
        ) : (
          <button
            className="button button-primary"
            disabled={completed.length === 0}
            onClick={() => {
              setStarted(false);
              setFinished(true);
            }}
          >
            Concluir treino
          </button>
        )}
      </div>

      {started && (
        <InlineAlert kind="success">
          Treino iniciado. Marque cada exercício conforme concluir.
        </InlineAlert>
      )}
      {finished && (
        <InlineAlert kind="success">
          Treino registrado com sucesso. Você concluiu {completed.length} exercícios.
        </InlineAlert>
      )}

      <div className="exercise-list">
        {exercises.slice(0, workout.exercises).map((exercise, index) => (
          <article className="exercise-row" key={exercise.name}>
            {started ? (
              <label className="exercise-check">
                <input
                  type="checkbox"
                  checked={completed.includes(exercise.name)}
                  onChange={(event) =>
                    setCompleted((current) =>
                      event.target.checked
                        ? [...current, exercise.name]
                        : current.filter((name) => name !== exercise.name),
                    )
                  }
                />
                <span className="sr-only">Concluir {exercise.name}</span>
              </label>
            ) : (
              <span className="exercise-number">{String(index + 1).padStart(2, '0')}</span>
            )}
            <div>
              <h2>{exercise.name}</h2>
              <p>{exercise.load}</p>
            </div>
            <dl>
              <div>
                <dt>Séries</dt>
                <dd>{exercise.sets}</dd>
              </div>
              <div>
                <dt>Descanso</dt>
                <dd>{exercise.rest}</dd>
              </div>
            </dl>
            <button
              className="button button-quiet"
              aria-expanded={instructions === exercise.name}
              onClick={() =>
                setInstructions((current) => (current === exercise.name ? null : exercise.name))
              }
            >
              {instructions === exercise.name ? 'Ocultar instruções' : 'Ver instruções'}
            </button>
            {instructions === exercise.name && (
              <div className="exercise-instructions">
                Mantenha a postura neutra, controle o movimento e interrompa se sentir dor. Respire
                durante toda a execução.
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/login-page';
import { RegisterPage } from '@/features/auth/pages/register-page';
import { ProfilePage } from '@/features/auth/pages/profile-page';
import { ForbiddenPage } from '@/features/auth/pages/forbidden-page';
import { ContextSelectionPage } from '@/features/context/pages/context-selection-page';
import { NoAcademyPage } from '@/features/context/pages/no-academy-page';
import { ActiveContextProvider } from '@/features/context/model/context-provider';
import { AppLayout } from '@/layouts/app-layout';
import { StudentWorkoutsPage } from '@/features/training/pages/student-workouts-page';
import { TeacherPlansPage } from '@/features/training/pages/teacher-plans-page';
import { StudentWorkoutDetailPage } from '@/features/training/pages/student-workout-detail-page';
import { TeacherPlanDetailPage } from '@/features/training/pages/teacher-plan-detail-page';
import {
  AnonymousOnly,
  RequireAcademyFunction,
  RequireContext,
  RequireGlobalRole,
  RequireProfile,
  RequireSession,
} from './guards';
import { HomeRouter, ModulePlaceholder } from './home-router';

const protectedTree = (node: React.ReactNode) => (
  <RequireSession>
    <RequireProfile>
      <ActiveContextProvider>{node}</ActiveContextProvider>
    </RequireProfile>
  </RequireSession>
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AnonymousOnly>
              <LoginPage />
            </AnonymousOnly>
          }
        />
        <Route
          path="/cadastro"
          element={
            <AnonymousOnly>
              <RegisterPage />
            </AnonymousOnly>
          }
        />
        <Route path="/" element={protectedTree(<AppLayout />)}>
          <Route index element={<HomeRouter />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="selecionar-contexto" element={<ContextSelectionPage />} />
          <Route path="sem-academia" element={<NoAcademyPage />} />
          <Route path="forbidden" element={<ForbiddenPage />} />
          <Route
            path="admin/academias"
            element={
              <RequireGlobalRole>
                <ModulePlaceholder
                  eyebrow="Administração global"
                  title="Academias"
                  description="Gerencie as academias da plataforma."
                />
              </RequireGlobalRole>
            }
          />
          <Route
            path="app/treinos"
            element={
              <RequireContext>
                <RequireAcademyFunction functions={['aluno']}>
                  <StudentWorkoutsPage />
                </RequireAcademyFunction>
              </RequireContext>
            }
          />
          <Route
            path="app/planos"
            element={
              <RequireContext>
                <RequireAcademyFunction functions={['professor']}>
                  <TeacherPlansPage />
                </RequireAcademyFunction>
              </RequireContext>
            }
          />
          <Route
            path="app/treinos/:workoutId"
            element={
              <RequireContext>
                <RequireAcademyFunction functions={['aluno']}>
                  <StudentWorkoutDetailPage />
                </RequireAcademyFunction>
              </RequireContext>
            }
          />
          <Route
            path="app/planos/:planId"
            element={
              <RequireContext>
                <RequireAcademyFunction functions={['professor']}>
                  <TeacherPlanDetailPage />
                </RequireAcademyFunction>
              </RequireContext>
            }
          />
          <Route
            path="app/membros"
            element={
              <RequireContext>
                <RequireAcademyFunction functions={['admin_academia']}>
                  <ModulePlaceholder
                    eyebrow="Gestão da academia"
                    title="Membros"
                    description="Organize alunos, professores e seus vínculos."
                  />
                </RequireAcademyFunction>
              </RequireContext>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useQuery } from '@tanstack/react-query';
import { useAppServices } from '@/app/providers/app-context';
import { trainingApi } from '../api/training-api';

export function useStudentWorkouts() {
  const { apiClient } = useAppServices();
  return useQuery({
    queryKey: ['student-workouts'],
    queryFn: trainingApi(apiClient).studentWorkouts,
  });
}

export function useTeacherPlans() {
  const { apiClient } = useAppServices();
  return useQuery({
    queryKey: ['teacher-plans'],
    queryFn: trainingApi(apiClient).teacherPlans,
  });
}

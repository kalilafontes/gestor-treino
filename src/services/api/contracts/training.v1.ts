export interface StudentWorkout {
  id: string;
  title: string;
  coach: string;
  frequency: string;
  exercises: number;
  duration: string;
  status: string;
}

export interface TeacherPlan {
  id: string;
  title: string;
  students: number;
  exercises: number;
  updatedAt: string;
}

export interface CreateTeacherPlanRequest {
  title: string;
  exercises: number;
}

export interface ScreeningData {
  userName: string;
  level: 'red' | 'yellow' | 'green' | 'normal';
  levelName: string;
  symptoms: string;
  userId?: string;
  date?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

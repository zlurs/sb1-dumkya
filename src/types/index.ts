export interface Workplace {
  id: string;
  userId: string;
  name: string;
  location: string;
  positions: Position[];
}

export interface Position {
  id: string;
  title: string;
  hourlyWage: number;
}

export interface Shift {
  id: string;
  userId: string;
  date: Date;
  workplaceId: string;
  positionId: string;
  hoursWorked: number;
  cashTips: number;
  cardTips: number;
  hourlyWage: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  workplaces: Workplace[];
  emailVerified: boolean;
}

export interface UserPreferences {
  currency: string;
  timezone: string;
  defaultView: 'dashboard' | 'calendar';
}
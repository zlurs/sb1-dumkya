// Sample data for testing
export const sampleData = {
  user: {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    emailVerified: true
  },
  workplaces: [
    {
      id: '1',
      userId: '1',
      name: 'The Coffee House',
      location: 'Downtown',
      positions: [
        { id: '1', title: 'Barista', hourlyWage: 15 },
        { id: '2', title: 'Server', hourlyWage: 12 }
      ]
    },
    {
      id: '2',
      userId: '1',
      name: 'City Restaurant',
      location: 'Uptown',
      positions: [
        { id: '3', title: 'Waiter', hourlyWage: 10 },
        { id: '4', title: 'Bartender', hourlyWage: 18 }
      ]
    }
  ],
  shifts: [
    {
      id: '1',
      userId: '1',
      date: new Date(2024, 1, 15),
      workplaceId: '1',
      positionId: '1',
      hoursWorked: 8,
      cashTips: 120,
      cardTips: 80,
      hourlyWage: 15
    },
    {
      id: '2',
      userId: '1',
      date: new Date(2024, 1, 16),
      workplaceId: '2',
      positionId: '3',
      hoursWorked: 6,
      cashTips: 90,
      cardTips: 150,
      hourlyWage: 10
    },
    {
      id: '3',
      userId: '1',
      date: new Date(),
      workplaceId: '1',
      positionId: '2',
      hoursWorked: 7,
      cashTips: 140,
      cardTips: 110,
      hourlyWage: 12
    }
  ],
  preferences: {
    currency: 'USD',
    timezone: 'UTC',
    defaultView: 'dashboard' as const
  }
}
import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import { ShiftEntry } from './components/ShiftEntry'
import { Layout } from './components/Layout'
import { Calendar } from './components/Calendar'
import { Settings } from './components/Settings'
import { Shifts } from './components/Shifts'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="shifts" element={<Shifts />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="settings" element={<Settings />} />
        <Route path="new-shift" element={<ShiftEntry />} />
      </Route>
    </Routes>
  )
}
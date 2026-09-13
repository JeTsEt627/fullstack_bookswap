import { Chip } from '@mui/material'
import type { BookStatus } from '../types'

const labels = { available: 'Доступна', reserved: 'Забронирована', borrowed: 'На руках' }
const colors = { available: 'success', reserved: 'warning', borrowed: 'default' } as const

function StatusChip({ status }: { status: BookStatus }) {
  return <Chip size="small" label={labels[status]} color={colors[status]} variant="outlined" />
}

export default StatusChip

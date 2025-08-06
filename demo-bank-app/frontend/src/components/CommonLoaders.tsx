import { Box, CircularProgress } from '@mui/material'


export default function CommonLoaders() {
  return (
    <Box height="100%" minHeight={200} flexGrow={1} alignItems="center" justifyContent="center" display="flex">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box sx={{ mb: 2 }}>
          <CircularProgress />
        </Box>
      </Box>
    </Box>
  )
}


import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularLoading() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}
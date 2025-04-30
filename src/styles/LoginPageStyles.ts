import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(8),
}));

export const styles = {
  container: {
    maxWidth: 'sm' as const,
  },
  tabs: {
    borderBottom: 1,
    borderColor: 'divider',
  },
  formButton: {
    mt: 3,
    mb: 2,
  },
}; 
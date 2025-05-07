import { Box, Typography, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

export const NavBar = styled(Box)(({ theme }) => ({
    width: '200px',
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
}))

export const MainContent = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(3),
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '200px',
}))

export const ProfileSection = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1100,
}))

export const DeviceBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '300px',
    height: '200px',
    marginTop: theme.spacing(8),
}))

export const NavItem = styled(Typography)(({ theme }) => ({
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        borderRadius: theme.shape.borderRadius,
    },
}))

export const PageWrapper = styled(Box)({
    position: 'relative',
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
})

export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(8),
}))

export const StyledRegisteredUser = styled(Typography)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: '8px',
    paddingBlock: '4px',
    color: 'white',
}))

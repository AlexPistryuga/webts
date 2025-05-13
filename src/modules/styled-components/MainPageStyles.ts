import { Box, Typography, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

export const NavBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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

export const NavIconOutlined = styled(NavItem)(() => ({
    display: 'flex',
    flexWrap: 'nowrap',
    border: '1px solid gray',
    borderRadius: '8px',
    alignItems: 'center',
    justifyContent: 'center',
}))

export const PageWrapper = styled(Box)({
    position: 'relative',
    display: 'flex',
    minHeight: '100vh',
    marginLeft: '220px',
    width: 'calc(100vw - 244px)',
})

export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(8),
}))

export const StyledFlexRowShell = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: '1rem',
}))

export const StyledFlexColumnShell = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1rem',
}))

import { AccountBox, Logout, MonetizationOn, Transcribe } from '@mui/icons-material';
import { AppBar, Avatar, Box, Button, Toolbar, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import User, { IUser } from './User';
import { deepOrange } from '@mui/material/colors';
import { getSessionHint } from '../utils/cookie';

const navItems = [
    { name: 'Accounts', path: '/', icon: <AccountBox /> },
    { name: 'Transactions', path: '/transactions', icon: <Transcribe /> },
];

interface NavBarProps {
    user: IUser | null
}
export default function NavBar(props: NavBarProps) {
    const { user } = props
    const navigate = useNavigate();
    // Match the current route
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        // Add logout logic here
        window.location.href = '/auth/logout?session_hint=' + getSessionHint();
    };


    const selectedAccount = navItems.find((item) => item.path === location.pathname);
    return (
        <AppBar position='sticky'>
            <Toolbar>
                <MonetizationOn sx={{ height: 90, width: 50 }} />
                &nbsp;
                <Typography
                    variant="h4"
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                >
                    Demo Bank
                    &nbsp;
                    <Typography component="span" variant='h6' sx={{ opacity: 0.5 }}>
                        {selectedAccount?.name}
                    </Typography>
                </Typography>

                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {user && navItems.map((item) => (
                        <Button key={item.name} startIcon={item.icon} sx={{ color: '#fff', opacity: location?.pathname === item.path ? 1 : 0.5 }} onClick={() => navigate(item.path)}>
                            {item.name}
                        </Button>
                    ))}
                </Box>
                {user &&
                    <>
                        <IconButton
                            size="medium"
                            onClick={handleMenuOpen}
                        >
                            <Avatar sx={{ bgcolor: deepOrange[500] }}>{`${user.first_name[0]}${user.last_name[0]}`}</Avatar>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                        >
                            <User user={user} />
                            <MenuItem onClick={handleLogout}> <Logout /> &nbsp; Logout</MenuItem>
                        </Menu>
                    </>
                }
            </Toolbar>
        </AppBar>


    )
}

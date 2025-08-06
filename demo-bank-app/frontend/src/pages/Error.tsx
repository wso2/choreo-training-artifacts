
import { Box, Typography, Button } from '@mui/material';

interface ErrorProps {
    type: '404' | 'auth';
}

export default function Error(props: ErrorProps) {
    const { type } = props;
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            textAlign="center"
            bgcolor="#f5f5f5"
            p={3}
        >
            {type === '404' ? (
                <>
                    <Typography variant="h2" color="error" gutterBottom>
                        404
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Oops! The page you're looking for doesn't exist.
                    </Typography>
                    <Button variant="contained" color="primary" href="/">
                        Go to Homepage
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h2" color="error" gutterBottom>
                        Unauthorized
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        You don't have permission to access this page.
                    </Typography>
                    <Button variant="contained" color="primary" href="/auth/login">
                        Go to Login
                    </Button>
                </>
            )}
        </Box>
    );

}

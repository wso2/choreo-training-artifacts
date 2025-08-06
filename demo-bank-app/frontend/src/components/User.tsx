import { Avatar, Box, Divider, Typography } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

export interface IUser {
    email: string,
    first_name: string,
    last_name: string,
    username: string,
    groups: string[],

}
export const mockUser: IUser = {
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    groups: ["admin", "user"],
};

interface userProps {
    user?: IUser
}

export default function User(props?: userProps) {
    const { email, first_name, last_name, username } = props?.user ?? mockUser
    return (
        <Box display="flex" borderRadius={1} gap={1} flexDirection="column" alignItems="flex-start" justifyContent="center" p={2}>
            <Box display="flex" alignItems="center" gap={1} justifyContent="center" mb={1}>
                <Avatar sx={{ bgcolor: deepOrange[500] }}>{`${first_name[0]}${last_name[0]}`}</Avatar>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Typography variant="h6" paddingBottom={-3} noWrap>
                        {first_name} {last_name}
                        <Typography component="span" fontFamily="serif" fontSize={14} color="text.secondary">
                            &nbsp;({username})
                        </Typography>
                    </Typography>
                </Box>
            </Box>
            <Divider sx={{ width: '100%'}} />
            <Typography fontSize={14} color="text.secondary">
                Email: {email}<br/>
            </Typography>
        </Box>
    )
}

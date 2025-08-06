import { Alert, AlertColor } from '@mui/material'
import { WarningSharp } from '@mui/icons-material';

export default function NoData(props: { message?: string, color?: AlertColor }) {
    const { message } = props
    return (
        <Alert icon={<WarningSharp fontSize="inherit" />} severity="success" color="warning">
            {message ?? "Here is a gentle confirmation that your action was successful."}
        </Alert>
    )
}

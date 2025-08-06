import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import { BankAccount, createAccount } from '../api';
import { Add } from '@mui/icons-material';



export default function NewAccount(props: { fetchAccounts:  () => void }) {
    const [open, setOpen] = useState(false);
    const { fetchAccounts } = props;
    const [formData, setFormData] = useState<BankAccount>({
        user_id: 0,
        owner: '',
        account_no: '',
        bank_name: '',
        balance: 0,
        id: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'balance' || name === 'user_id' ? Number(value) : value,
        }));
    };

    const handleSubmit = () => {
        createAccount(formData).finally(fetchAccounts)
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" startIcon={<Add />} size='medium' color="primary" onClick={() => setOpen(true)}>
                Create an Account
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create New Bank Account</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Owner"
                        name="owner"
                        fullWidth
                        size='small'
                        value={formData.owner}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Account Number"
                        name="account_no"
                        fullWidth
                        size='small'
                        value={formData.account_no}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Bank Name"
                        name="bank_name"
                        fullWidth
                        size='small'
                        value={formData.bank_name}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} size="small" variant='outlined' color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} size="small"  startIcon={<Add />} variant='contained' color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

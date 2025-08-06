import { useCallback, useEffect, useMemo } from 'react'
import { BankAccount, createTransaction, getTransactions, Transaction } from '../api'
import { Alert, AlertTitle, Autocomplete, Box, CircularProgress, Divider, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material'
import { Stack, Button } from '@mui/material'
import { useState } from 'react'
import NoData from './NoData'
import { Check, Close, History, MonetizationOn, NewLabel } from '@mui/icons-material'
import { getAccountMap } from '../utils/accounts'
import CommonLoaders from './CommonLoaders'

interface TransactionProps {
    from: BankAccount | null;
    onClose: () => void
    accounts: BankAccount[]
}

export default function TransactionView(props: TransactionProps) {
    const { from, accounts, onClose } = props
    const acountMap = useMemo(() => getAccountMap(accounts), [accounts])
    const [transferForm, setTransferForm] = useState({
        to_account_no: '',
        to_bank: '',
        amount: ''
    })
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [tabIndex, setTabIndex] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

    const fetchTransactions = useCallback(async () => {
        if (!from) return
        const data = await getTransactions(from.id);
        setTransactions(data.reverse());
        setIsLoading(false)
    }, [from])

    useEffect(() => {
        if (tabIndex === 1) {
            setIsLoading(true)
            fetchTransactions();
        }
    }, [fetchTransactions, from, tabIndex])


    const [isLoadingTransfer, setIsLoadingTransfer] = useState(false)
    const handleTransfer = async () => {
        if (!from || transferForm.to_account_no === '' || transferForm.to_bank === '' || transferForm.amount === '') {
            return
        }
        try {
            setIsLoadingTransfer(true)
            await createTransaction({
                from_account_id: from.id,
                account_no: transferForm.to_account_no,
                bank_name: transferForm.to_bank,
                amount: parseFloat(transferForm.amount),
                currency: 'USD',
                user_id: 1,
            });
            fetchTransactions();
            setTransferForm({ to_account_no: '', to_bank: '', amount: '' });
            setTabIndex(1);
        } catch (e) {
            console.error('Transaction failed', e);
        }
        setIsLoadingTransfer(false)
    };

    const isNotCompleted = isLoadingTransfer || transferForm.to_account_no === '' || transferForm.to_bank === '' || transferForm.amount === ''
    return (
        <Box sx={{ width: 400 }} gap={1} p={2} display="flex" flexDirection="column">
            <Typography variant="h6" gutterBottom>
                Account Transactions
                <IconButton
                    onClick={onClose}
                    sx={{ float: 'right' }}
                    color='error'
                    size='small'
                >
                    <Close />
                </IconButton>
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
                <Tabs sx={{ height: 50 }} value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)}>
                    <Tab label="New Transaction" icon={<NewLabel />} iconPosition='start' />
                    <Tab label="History" icon={<History />} iconPosition='start' />
                </Tabs>
                {tabIndex === 0 && (
                    <Box p={2}>
                        {from && (
                            <Stack spacing={2}>
                                <TextField
                                    label="Sender Name"
                                    value={from.owner}
                                    size="small"
                                    disabled
                                />
                                <TextField
                                    label="Sender Account"
                                    value={from.account_no}
                                    size="small"
                                    disabled
                                />
                                <TextField
                                    label="Sender Bank"
                                    value={from.bank_name}
                                    size="small"
                                    disabled
                                />
                                <Autocomplete
                                    options={accounts.filter((account) => account.id !== from.id)}
                                    getOptionLabel={(option) => `${option.account_no} (${option.bank_name})`}
                                    renderInput={(params) => <TextField {...params} label="Recipient Account" size="small" />}
                                    onChange={(_, value) => {
                                        if (value) {
                                            setTransferForm({
                                                ...transferForm,
                                                to_account_no: value.account_no,
                                                to_bank: value.bank_name
                                            })
                                        }
                                    }}
                                    value={accounts.find((account) => account.account_no === transferForm.to_account_no) ?? null}
                                    isOptionEqualToValue={(option, value) => option.account_no === value.account_no}
                                    size="small"
                                />
                                <TextField
                                    label="Recipient Bank"
                                    disabled
                                    value={transferForm.to_bank}
                                    onChange={(e) => setTransferForm({ ...transferForm, to_bank: e.target.value })}
                                    size="small"
                                />
                                <TextField
                                    label="Amount (USD)"
                                    type="number"
                                    value={transferForm.amount}
                                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                                    size="small"
                                />
                                <Button variant="contained" disabled={isNotCompleted} startIcon={isLoadingTransfer ? <CircularProgress size={15} /> :<MonetizationOn />} onClick={handleTransfer}>Transfer</Button>
                            </Stack>
                        )}
                    </Box>
                )}
                {tabIndex === 1 && (
                    <Box p={2}>

                        {isLoading ? <CommonLoaders /> : <>
                            {transactions.length > 0 ? (
                                <Stack spacing={1}>
                                    {transactions.map((transaction, index) => (
                                        <Alert severity={from?.id !== transaction.from_account_id ? "success" : "info"} icon={<Check />} key={index}>
                                            <AlertTitle>
                                                {from?.id === transaction.from_account_id ? "Transferred:" : "Received:"}
                                                &nbsp;
                                                {transaction.amount.toFixed(2)} {transaction.currency}
                                            </AlertTitle>

                                            <Divider sx={{ width: '100%', mb: 0.5 }} />
                                            <Typography variant="body2" fontSize={12} color="text.secondary">
                                                {from?.id === transaction.from_account_id ? <> To: {acountMap.get(transaction.to_account_id)?.account_no}</> : <>From: {acountMap.get(transaction.from_account_id)?.account_no ?? 'N/A'} </>}
                                                &nbsp;<br />
                                                Date/Time: {new Date(transaction.created_at).toLocaleString()}
                                            </Typography>
                                        </Alert>
                                    ))}
                                </Stack>
                            ) : (
                                <NoData message="No transactions found." />
                            )}
                        </>}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

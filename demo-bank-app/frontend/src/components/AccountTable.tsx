import React from 'react'
import { BankAccount } from '../api'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, IconButton, Tooltip } from '@mui/material';
import {  DeleteForeverOutlined } from '@mui/icons-material';

interface AccountTableProps {
    accounts: BankAccount[],
    onSelect: (account: BankAccount) => void
    selectedAccountId: number | null
    handleDelete: (account: BankAccount) => void
}

export const AccountTable: React.FC<AccountTableProps> = (props) => {
    const { accounts, handleDelete } = props
    return (
        <TableContainer component={Box}>
            <Table size='small'>
                <TableHead>
                    <TableRow style={{ backgroundColor: "#eee" }}>
                        <TableCell align='center'>ID</TableCell>
                        <TableCell>Owner Name</TableCell>
                        <TableCell align='right'>Account No</TableCell>
                        <TableCell>Bank</TableCell>
                        <TableCell align='right'>Balance</TableCell>
                        <TableCell align='center'/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow
                            key={account.account_no}
                            onClick={() => props.onSelect(account)}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: props.selectedAccountId === account.id ? '#f0f8ff' : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (props.selectedAccountId !== account.id) {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (props.selectedAccountId !== account.id) {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <TableCell align='center'>{account.id}</TableCell>
                            <TableCell >{account.owner}</TableCell>
                            <TableCell align='right'>{account.account_no}</TableCell>
                            <TableCell>{account.bank_name}</TableCell>
                            <TableCell align='right'>{account.balance.toFixed(2)} USD</TableCell>
                            <TableCell align='right'>
                                <Tooltip title="Delete Account" arrow>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                        handleDelete(account);
                                        e.stopPropagation();
                                        // Handle delete action here
                                    }}
                                >
                                    <DeleteForeverOutlined />
                                </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

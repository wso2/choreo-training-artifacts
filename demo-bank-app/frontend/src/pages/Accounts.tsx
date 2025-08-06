import { useEffect, useMemo, useState } from 'react';
import { getAccounts, BankAccount, deleteAccount } from '../api';
import { Collapse, MenuItem, Select, FormControl, InputLabel, Box, TextField, Divider, InputAdornment, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { AccountTable } from '../components/AccountTable';
import TransactionView from '../components/Transaction';
import NewAccount from '../components/NewAccount';
import CommonLoaders from '../components/CommonLoaders';
import NoData from '../components/NoData';
import { Search } from '@mui/icons-material';

export const Accounts = () => {

  const [searchValue, setSearchValue] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const accounts = await getAccounts();
      setAccounts(accounts);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const [toDeleteAccount, setToDeleteAccount] = useState<BankAccount | null>(null);
  const handleDelete = async (account: BankAccount) => {
    setToDeleteAccount(account);
    // if (window.confirm(`Are you sure you want to Delete account ${account.account_no}?`)) {
    //   try {
    //     // Call the API to delete the account
    //     // await deleteAccount(account.id);
    //     // Fetch the updated accounts list
    //     deleteAccount(account.id);
    //     await fetchAccounts();
    //   } catch (error) {
    //     console.error('Error deleting account:', error);
    //   }
    // }
  };

  const sortedAccounts = useMemo(() => {
    return [...accounts]
      .filter(acc => JSON.stringify(acc).includes(searchValue))
      .sort((a, b) => (sort === 'asc' ? a.balance - b.balance : b.balance - a.balance));
  }, [accounts, searchValue, sort]);

  return (
    <Box display="flex" width="100%" flexGrow={1}>
      <Box display="flex" flexDirection="column" gap={1} flexGrow={1} p={2}>
        <Box display="flex" gap={1} justifyContent="flex-end" alignItems={'center'}>

          <TextField
            id="sort"
            value={searchValue}
            size='small'
            placeholder="Search Accounts"
            onChange={(e) => setSearchValue(e.target.value)}
            variant="outlined"
            sx={{ width: 300 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small" variant='outlined'>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              id="sort"
              value={sort}

              label="Sort"
              onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value={'asc'}>Balance: Low → High</MenuItem>
              <MenuItem value={'desc'}>Balance: High → Low</MenuItem>
            </Select>
          </FormControl>
          <NewAccount fetchAccounts={fetchAccounts} />
        </Box>
        <Box display="flex" flexGrow={1} flexDirection="column" overflow="hidden">
          <Divider />
          {isLoading ?
            (<CommonLoaders />) :
            (<AccountTable handleDelete={handleDelete} accounts={sortedAccounts} onSelect={(account) => setSelectedAccount(account)} selectedAccountId={selectedAccount?.id ?? null} />)}
          {sortedAccounts.length === 0 && !isLoading && (
            <NoData message='No Accounts Found' />
          )}
        </Box>
      </Box>
      {selectedAccount && <Divider orientation='vertical' />}
      <Collapse in={!!selectedAccount} orientation='horizontal' unmountOnExit>
        <TransactionView from={selectedAccount} accounts={accounts} onClose={() => setSelectedAccount(null)} />
      </Collapse>
      {toDeleteAccount && (
        <Dialog
          open={!!toDeleteAccount}
          onClose={() => setToDeleteAccount(null)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete account {toDeleteAccount.account_no}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setToDeleteAccount(null)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  await deleteAccount(toDeleteAccount.id);
                  await fetchAccounts();
                } catch (error) {
                  console.error('Error deleting account:', error);
                } finally {
                  setToDeleteAccount(null);
                }
              }}
              color="error"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
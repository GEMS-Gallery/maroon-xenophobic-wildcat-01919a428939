import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { backend } from '../../declarations/backend';

interface TaxPayer {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string | null;
}

const TaxPayerList: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    try {
      const result = await backend.getTaxPayers();
      setTaxPayers(result);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
      setLoading(false);
      setError('An error occurred while fetching tax payers. Please try again.');
    }
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        setLoading(true);
        const result = await backend.searchTaxPayer(BigInt(searchTerm));
        if (result) {
          setTaxPayers([result]);
        } else {
          setTaxPayers([]);
        }
        setError(null);
      } catch (error) {
        console.error('Error searching tax payer:', error);
        setError('An error occurred while searching for the tax payer. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      fetchTaxPayers();
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', textShadow: '2px 2px #000000' }}>TaxPayer Records</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <TextField
          label="Search by TID"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', flexGrow: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <CircularProgress style={{ display: 'block', margin: '20px auto' }} />
      ) : (
        <TableContainer component={Paper} style={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>TID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxPayers.map((taxPayer) => (
                <TableRow key={taxPayer.tid.toString()}>
                  <TableCell>{taxPayer.tid.toString()}</TableCell>
                  <TableCell>{taxPayer.firstName}</TableCell>
                  <TableCell>{taxPayer.lastName}</TableCell>
                  <TableCell>{taxPayer.address || 'N/A'}</TableCell>
                  <TableCell>
                    <Link to={`/edit/${taxPayer.tid}`}>
                      <Button variant="contained" color="primary" size="small">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default TaxPayerList;

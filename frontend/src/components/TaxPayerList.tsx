import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, CircularProgress } from '@mui/material';
import DataTable from 'react-data-table-component';
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

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    try {
      const result = await backend.getTaxPayers();
      setTaxPayers(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
      setLoading(false);
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
      } catch (error) {
        console.error('Error searching tax payer:', error);
      } finally {
        setLoading(false);
      }
    } else {
      fetchTaxPayers();
    }
  };

  const columns = [
    {
      name: 'TID',
      selector: (row: TaxPayer) => Number(row.tid),
      sortable: true,
    },
    {
      name: 'First Name',
      selector: (row: TaxPayer) => row.firstName,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: (row: TaxPayer) => row.lastName,
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row: TaxPayer) => row.address || 'N/A',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row: TaxPayer) => (
        <Link to={`/edit/${row.tid}`}>
          <Button variant="contained" color="primary" size="small">
            Edit
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h1>TaxPayer Records</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <TextField
          label="Search by TID"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataTable
          columns={columns}
          data={taxPayers}
          pagination
          highlightOnHover
          responsive
        />
      )}
    </div>
  );
};

export default TaxPayerList;

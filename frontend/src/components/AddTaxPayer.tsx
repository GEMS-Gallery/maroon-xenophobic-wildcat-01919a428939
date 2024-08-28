import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from '../../declarations/backend';

interface FormData {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
}

const AddTaxPayer: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await backend.addTaxPayer(
        BigInt(data.tid),
        data.firstName,
        data.lastName,
        data.address ? [data.address] : []
      );
      if ('ok' in result) {
        alert('TaxPayer added successfully');
        navigate('/');
      } else {
        setError(`Error: ${result.err}`);
      }
    } catch (error) {
      console.error('Error adding tax payer:', error);
      setError('An error occurred while adding the tax payer. This is the intentional error we created.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', textShadow: '2px 2px #000000' }}>Add New TaxPayer</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="tid"
          control={control}
          rules={{ required: 'TID is required', pattern: { value: /^\d+$/, message: 'TID must be a number' } }}
          render={({ field }) => (
            <TextField
              {...field}
              label="TID"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.tid}
              helperText={errors.tid?.message}
            />
          )}
        />
        <Controller
          name="firstName"
          control={control}
          rules={{ required: 'First name is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          rules={{ required: 'Last name is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          style={{ marginTop: '20px', width: '100%' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Add TaxPayer'}
        </Button>
      </form>
    </div>
  );
};

export default AddTaxPayer;

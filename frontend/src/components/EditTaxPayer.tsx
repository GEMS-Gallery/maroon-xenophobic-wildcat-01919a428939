import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from '../../declarations/backend';

interface FormData {
  firstName: string;
  lastName: string;
  address: string;
}

const EditTaxPayer: React.FC = () => {
  const { tid } = useParams<{ tid: string }>();
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaxPayer = async () => {
      try {
        const result = await backend.searchTaxPayer(BigInt(tid!));
        if (result) {
          setValue('firstName', result.firstName);
          setValue('lastName', result.lastName);
          setValue('address', result.address ? result.address : '');
          setError(null);
        } else {
          setError('TaxPayer not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching tax payer:', error);
        setError('An error occurred while fetching the tax payer. Please try again.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchTaxPayer();
  }, [tid, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await backend.updateTaxPayer(
        BigInt(tid!),
        data.firstName,
        data.lastName,
        data.address ? [data.address] : []
      );
      if ('ok' in result) {
        alert('TaxPayer updated successfully');
        navigate('/');
      } else {
        setError(`Error: ${result.err}`);
      }
    } catch (error) {
      console.error('Error updating tax payer:', error);
      setError('An error occurred while updating the tax payer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', textShadow: '2px 2px #000000' }}>Edit TaxPayer</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
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
          {loading ? <CircularProgress size={24} /> : 'Update TaxPayer'}
        </Button>
      </form>
    </div>
  );
};

export default EditTaxPayer;

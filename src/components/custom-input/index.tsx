import { FC } from 'react';

interface CustomInputProps {
  label: string;
  inputValue: string;
  onCustomInputChange: (value: string) => void;
}

export const CustomInput: FC<CustomInputProps> = ({ label, inputValue, onCustomInputChange }) => {
  return (
    <label style={{ display: 'flex', flexDirection: 'column' }}>
      <span>{label}</span>
      <input type='text' value={inputValue} onChange={(event) => onCustomInputChange(event.target.value)} />
    </label>
  );
};

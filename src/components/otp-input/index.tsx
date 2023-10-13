import { FC, KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import styles from './otp-input.module.css';

interface OtpInputProps {
  onOtpCodeValue: (value: string) => void;
  otpCodeValue?: string;
}

export const OtpInput: FC<OtpInputProps> = ({ otpCodeValue, onOtpCodeValue }) => {
  const [inputsValue, setInputsValue] = useState(['', '', '', '']);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const activeOTPWindowRef = useRef(0);

  const goToNextOTPWindow = () => {
    if (activeOTPWindowRef.current < inputsValue.length - 1) {
      activeOTPWindowRef.current += 1;
      inputRefs.current[activeOTPWindowRef.current]?.focus();
    }
  };

  const goToPrevOTPWindow = () => {
    if (activeOTPWindowRef.current > 0) {
      activeOTPWindowRef.current -= 1;
      inputRefs.current[activeOTPWindowRef.current]?.focus();
    }
  };

  const handleOTPWindowFocus = (index: number) => (activeOTPWindowRef.current = index);

  const handleOTPWindowChange =
    (index: number): KeyboardEventHandler<HTMLInputElement> =>
    (event) => {
      const pressedKey = event.key;
      if (pressedKey === 'ArrowLeft') {
        goToPrevOTPWindow();
      }

      if (pressedKey === 'ArrowRight') {
        goToNextOTPWindow();
      }

      if (!Number.isNaN(Number(pressedKey))) {
        const newInputsValue = [...inputsValue];
        newInputsValue[index] = pressedKey;
        setInputsValue(newInputsValue);
        goToNextOTPWindow();
      }

      if (pressedKey === 'Backspace') {
        const newInputsValue = [...inputsValue];
        newInputsValue[index] = '';
        setInputsValue(newInputsValue);
        goToPrevOTPWindow();
      }
    };

  useEffect(() => {
    if (inputsValue.every((inputValue) => inputValue !== '')) {
      const otpCode = inputsValue.join('');
      onOtpCodeValue(otpCode);
    }
  }, [inputsValue]);

  useEffect(() => {
    if (typeof otpCodeValue === 'string') {
      const newInputsValue = otpCodeValue.split('');

      setInputsValue(newInputsValue.length ? newInputsValue : ['', '', '', '']);
    }
  }, [otpCodeValue]);

  return (
    <div className={styles.inputsWrapper}>
      {inputsValue.map((_, index) => (
        <input
          value={inputsValue[index]}
          onChange={() => null}
          key={index}
          className={styles.input}
          type='text'
          inputMode='numeric'
          autoComplete='one-time-code'
          placeholder='_'
          maxLength={1}
          onKeyUp={handleOTPWindowChange(index)}
          onFocus={() => handleOTPWindowFocus(index)}
          ref={(inputNode) => (inputRefs.current[index] = inputNode)}
        />
      ))}
    </div>
  );
};

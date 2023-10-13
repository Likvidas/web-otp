import { FC, useEffect, useRef } from 'react';
import styles from './code-input.module.css';

interface CodeInputProps {
  value: ConfirmCodeInputState;
  onChange: (value: ConfirmCodeInputState) => void;
}
enum KeydownKey {
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  BackSpace = 'Backspace',
}

enum EventListenerKey {
  Keydown = 'keydown',
  Wheel = 'wheel',
}

export type ConfirmCodeInputState = [string, string, string, string];

export const getPrevIndex = (index: number) => {
  const prevIndex = index - 1;

  return prevIndex <= 0 ? 0 : prevIndex;
};

export const getNextIndex = (array: unknown[], index: number) => {
  const nextIndex = index + 1;
  const lastArrayIndex = array.length - 1;

  return lastArrayIndex >= nextIndex ? nextIndex : lastArrayIndex;
};

export const CodeInput: FC<CodeInputProps> = ({ onChange, value }) => {
  const INPUT_COUNT = ['', '', '', ''];

  const inputsRef = useRef<HTMLInputElement[]>([]);
  const indexRef = useRef(0);

  const createNewState = (index: number, data: string) => {
    const copyValue = [...value] as ConfirmCodeInputState;

    copyValue[index] = data;

    onChange(copyValue);
  };

  const handleChange = (index: number, num: string) => {
    if (num === 'Unidentified') {
      return;
    }

    const numWithTrim = num.trim();

    const isNumFilled = numWithTrim !== '';

    if (numWithTrim === KeydownKey.BackSpace) {
      createNewState(index, '');

      const newIndex = getPrevIndex(index);
      inputsRef.current[newIndex].focus();
    }

    if (isNumFilled && value[index] !== num && !Number.isNaN(Number(num))) {
      createNewState(index, num);
    }

    if (isNumFilled && !Number.isNaN(Number(num))) {
      const newIndex = getNextIndex(inputsRef.current, index);
      inputsRef.current[newIndex].focus();
    }
  };

  useEffect(() => {
    const _handle = ({ key }: { key: string }) => {
      if (key === KeydownKey.ArrowRight) {
        indexRef.current = getNextIndex(inputsRef.current, indexRef.current);
        inputsRef.current[indexRef.current].focus();
      }

      if (key === KeydownKey.ArrowLeft) {
        indexRef.current = getPrevIndex(indexRef.current);
        inputsRef.current[indexRef.current].focus();
      }
    };

    window.addEventListener(EventListenerKey.Keydown, _handle);
    inputsRef.current[0].focus();

    const _inputHandle = (event: Event) => {
      const _event = event as InputEvent;

      if (!_event?.inputType) {
        const { value } = event.currentTarget as unknown as { value: string };

        if (value.length > 1) {
          onChange(value.split('') as ConfirmCodeInputState);
        }
      }
    };

    const inputs = inputsRef.current;

    inputs.forEach((input) => input.addEventListener('input', _inputHandle));

    return () => {
      window.removeEventListener(EventListenerKey.Keydown, _handle);
      inputs.forEach((input) => input.removeEventListener('input', _inputHandle));
    };
  }, []);

  useEffect(() => console.log('value', value), [value]);

  return (
    <div className={styles.inputWrapper}>
      {INPUT_COUNT.map((_, index) => (
        <input
          className={styles.confirmInput}
          key={index}
          inputMode='numeric'
          autoComplete='one-time-code'
          type='text'
          value={value[index]}
          maxLength={1}
          onKeyUp={({ key }) => handleChange(index, key)}
          onFocus={() => {
            indexRef.current = index;
          }}
          ref={(instance) => {
            if (instance && inputsRef.current.length !== INPUT_COUNT.length) {
              inputsRef.current.push(instance);
            }
          }}
        />
      ))}
    </div>
  );
};

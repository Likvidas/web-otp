import { FC, useEffect, useState } from 'react';
import { CustomInput } from '../custom-input';
import styles from './modal.module.css';

interface ModalProps {
  onModalClose: VoidFunction;
}

export const Modal: FC<ModalProps> = ({ onModalClose }) => {
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const ac = new AbortController();

    if ('OTPCredential' in window) {
      navigator.credentials
        .get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp) => {
          otp?.code !== undefined && setCode(otp.code);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      ac.abort();
    };
  }, []);

  return (
    <>
      <div className={styles.overlay} onClick={onModalClose}></div>
      <div className={styles.modal}>
        {isFirstStep && <CustomInput label='Введите номер телефона' inputValue={phone} onCustomInputChange={setPhone} />}

        {!isFirstStep && <CustomInput label='Введите код из СМС' inputValue={code} onCustomInputChange={setCode} />}

        {isFirstStep && <button onClick={() => setIsFirstStep(false)}>Next Step</button>}
      </div>
    </>
  );
};

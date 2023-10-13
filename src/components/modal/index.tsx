import { FC, useEffect, useState } from 'react';
import { CustomInput } from '../custom-input';
// import { CodeInput, ConfirmCodeInputState } from '../code-input';
import { OtpInput } from '../otp-input';
import styles from './modal.module.css';

interface ModalProps {
  onModalClose: VoidFunction;
}

export const Modal: FC<ModalProps> = ({ onModalClose }) => {
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => console.log('code', code), [code]);

  // const parseCode = (code: string) => {
  //   if (code.length === 4) {
  //     const newCode = code.split('') as ConfirmCodeInputState;

  //     return newCode;
  //   } else {
  //     return ['', '', '', ''] as ConfirmCodeInputState;
  //   }
  // };

  // const handleCofirmInputChange = (code: ConfirmCodeInputState) => {
  //   const newCode = code.join();
  //   setCode(newCode);
  // };

  useEffect(() => {
    // const ac = new AbortController();

    if ('OTPCredential' in window) {
      // alert('функция OTPCredential работает в данном окружении');
      navigator.credentials
        .get({
          otp: { transport: ['sms'] },
          // signal: ac.signal,
        })
        .then((otp) => {
          if (otp?.code !== undefined) {
            // alert(`тип данных для Otp.code = ${typeof otp.code}`);

            setCode(otp.code);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      // ac.abort();
    };
  }, []);

  return (
    <>
      <div className={styles.overlay} onClick={onModalClose}></div>
      <div className={styles.modal}>
        {isFirstStep && <CustomInput label='Введите номер телефона' inputValue={phone} onCustomInputChange={setPhone} />}

        {!isFirstStep && <CustomInput label='Введите код из СМС' inputValue={code} onCustomInputChange={setCode} />}

        {Boolean(code) && <span> This code from SMS {code} </span>}

        {!isFirstStep && <OtpInput otpCodeValue={code} onOtpCodeValue={setCode} />}

        {isFirstStep && <button onClick={() => setIsFirstStep(false)}>Next Step</button>}
      </div>
    </>
  );
};

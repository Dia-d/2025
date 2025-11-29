import { useState } from 'react';
import { useUserCode } from '../context/UserCodeContext.jsx';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijklmnopqrstuvwxyz-=abcdefghijklmnopqrstuvwxyz<>,./;][';

const generateCode = (length = 16) => {
  const array = new Uint32Array(length);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    for (let index = 0; index < length; index += 1) {
      array[index] = Math.floor(Math.random() * CHARS.length);
    }
  }
  return Array.from(array, (value) => CHARS[value % CHARS.length]).join('');
};

const CodeModal = () => {
  const { code, setCode } = useUserCode();
  const [step, setStep] = useState('ask');
  const [inputCode, setInputCode] = useState('');
  const [generated, setGenerated] = useState('');

  if (code) return null;

  const handleHaveCode = () => setStep('enter');

  const handleNoCode = () => {
    const newCode = generateCode(16);
    setGenerated(newCode);
    setStep('generated');
  };

  const handleConfirmExisting = (event) => {
    event.preventDefault();
    if (!inputCode.trim()) return;
    setCode(inputCode.trim());
  };

  const handleAcceptGenerated = () => {
    if (!generated) {
      const newCode = generateCode(16);
      setGenerated(newCode);
      setCode(newCode);
      return;
    }
    setCode(generated);
  };

  return (
    <div className="code-modal-backdrop">
      <div className="code-modal">
        {step === 'ask' && (
          <>
            <h2>Welcome back, explorer</h2>
            <p className="muted">
              Do you already have a study code? This code keeps your progress so you can resume
              later from any device.
            </p>
            <div className="code-modal-actions">
              <button type="button" className="cta-button" onClick={handleHaveCode}>
                Yes, I have a code
              </button>
              <button type="button" className="ghost-button" onClick={handleNoCode}>
                No, create one for me
              </button>
            </div>
          </>
        )}

        {step === 'enter' && (
          <form onSubmit={handleConfirmExisting} className="code-modal-form">
            <h2>Enter your study code</h2>
            <p className="muted">Paste the 16‑character code we gave you earlier.</p>
            <input
              type="text"
              value={inputCode}
              onChange={(event) => setInputCode(event.target.value)}
              maxLength={32}
              className="code-input"
              placeholder="e.g. A9F3-..."
            />
            <div className="code-modal-actions">
              <button type="submit" className="cta-button">
                Continue
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setStep('ask')}
              >
                Back
              </button>
            </div>
          </form>
        )}

        {step === 'generated' && (
          <div className="code-modal-form">
            <h2>Your new study code</h2>
            <p className="muted">
              Save this 16‑character code somewhere safe. We&apos;ll use it to keep your progress in
              sync with our database.
            </p>
            <div className="generated-code">
              <code>{generated}</code>
            </div>
            <div className="code-modal-actions">
              <button type="button" className="cta-button" onClick={handleAcceptGenerated}>
                I&apos;ve saved it, let&apos;s go
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={handleNoCode}
              >
                Generate another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeModal;



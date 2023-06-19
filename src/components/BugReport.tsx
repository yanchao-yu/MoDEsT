import * as React from 'react';
import { useState } from 'react';
import { postData } from '../utils';

// @ts-ignore
export default function BugReport({ session_id }) {
  const [bug_description, setBugDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    postData(`${import.meta.env.VITE_SERVER_URL}/v1/bug-report`, {
      bug_description,
      session_id,
    })
      .then(async (data) => {
        console.log(data);
        setLoading(false);
        setSuccess(true);
        setBugDescription('');
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="input-div">
        <label className="styled-label" htmlFor="title">
          Session ID:
        </label>
        <input
          value={session_id}
          className="styled-input"
          id="title"
          disabled
        />
      </div>
      <div className="input-div">
        <label className="styled-label" htmlFor="embed-code">
          Please describe the issue you encountered. What happened ? What do you
          think should have happened?
        </label>
        <textarea
          rows={10}
          id="embed-code"
          className="styled-textarea"
          placeholder="Enter Bug Description"
          onChange={(e) => setBugDescription(e.currentTarget.value)}
        />
      </div>
      {bug_description.length > 10 && !success ? (
        <button onClick={handleSubmit} className="button bug-report-btn">
          {loading ? 'Please wait...' : 'Submit'}
        </button>
      ) : null}
      {success ? (
        <strong style={{ color: 'green' }}>
          Thanks! Your feedback has been sent successfully.
        </strong>
      ) : null}
    </div>
  );
}

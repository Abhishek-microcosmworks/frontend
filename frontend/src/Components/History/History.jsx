import React, { useState } from 'react';

function History() {
  const [historyDetails, setHistoryDetails] = useState([]);
  const handleGetHistory = async () => {
    const email = localStorage.getItem('email');
    try {
      const res = await fetch('http://localhost:5000/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        setHistoryDetails(data.historyDetails);
      } else {
        console.error('Error getting history:', res.statusText);
      }
    } catch (error) {
      console.error('Error showing history:', error);
    }
  };
  return (
    <div>
      <button onClick={handleGetHistory} type="button">
        Get History
      </button>
      {historyDetails.length > 0 && (
        <div>
          <h2>History Details:</h2>
          <ul>
            {historyDetails.map((historyDetail) => (
              <li key={historyDetails.id}>{historyDetail}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default History;

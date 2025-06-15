import React, { useState, useEffect } from 'react';

function Me() {
  const [answer, setAnswer] = useState("");

  const me = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/me`, {
        method: "GET",
      });

      const data = await res.text();
      console.log("Response:", data);

      // Set the message or any desired field from the response
      setAnswer(data || "No message in response");
    } catch (err) {
      console.error("Fetch failed:", err);
      setAnswer("Error fetching data");
    }
  };

  useEffect(() => {
    me();
  }, []);

  return <div>{answer}</div>;
}

export default Me;

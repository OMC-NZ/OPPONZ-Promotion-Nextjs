import { useState, useEffect } from 'react';

const useSearchStreet = (req) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = 'https://api.nzpost.co.nz/addresschecker/1.0/suggest?q=' + req + '&max=50';
    const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IlRFU1QiLCJwaS5hdG0iOiIxIn0.eyJzY29wZSI6W10sImF1dGhvcml6YXRpb25fZGV0YWlscyI6W10sImNsaWVudF9pZCI6ImNiMmU0OTE1MGNhMDQ3ZTZhMjdiZDY2ZWMyNDZiMWJmIiwiZXhwIjoxNzIyMzkxMTUwfQ.nX81RQno5LbalV9ySJdozqVqBABtHVYtx0mO8DhRdwo';
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'client_id' : process.env.NEXT_PUBLIC_NZPOST_CLIENT_ID
        }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.addresses);
      } catch (error) {
        setError(error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [req]);

  return { data, error };
};

export default useSearchStreet;

"use client"

import { useState } from 'react';

const normalizeAddressResults = (result) => (
  Array.isArray(result.addresses)
    ? result.addresses.map((address, index) => ({
      id: `${address.DPID || 'address'}-${index}`,
      dpid: address.DPID,
      fullAddress: address.FullAddress || '',
    })).filter((address) => address.fullAddress)
    : []
);

const useSearchStreet = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (req) => {
    const query = req.trim();

    if (loading || query.length < 2) {
      setData([]);
      setError(null);
      setLoading(false);
      return { addresses: [], error: null };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/backend/nzpost/address/search?q=${encodeURIComponent(query)}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Unable to search addresses');
      }

      const result = await response.json();
      const addresses = normalizeAddressResults(result);

      setData(addresses);
      return { addresses, error: null };
    } catch (error) {
      setError(error);
      setData([]);
      return { addresses: [], error };
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setData([]);
    setError(null);
  };

  return { data, loading, error, search, clear };
};

export default useSearchStreet;

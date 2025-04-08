// File: src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await axios.post('/api/whatsapp', { body: query });
      const parsed = res.data.split('\n\n').map(r => {
        const [site, titleLine, priceLine, url] = r.split('\n');
        return { site, title: titleLine, price: priceLine, url };
      });
      setResults(parsed);
    } catch (err) {
      setResults([{ site: 'Error', title: err.message, price: '', url: '' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <motion.h1 className="text-3xl font-bold mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>Price Bot Dashboard</motion.h1>
      <div className="flex gap-2 mb-6">
        <input
          className="px-4 py-2 rounded-lg border shadow w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. iPhone 14"
        />
        <button
          onClick={fetchPrices}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          {loading ? 'Searching...' : 'Compare'}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {results.map((res, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 rounded-2xl shadow-xl border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-2">{res.site}</h2>
            <p className="mb-1">{res.title}</p>
            <p className="text-green-600 font-bold mb-2">{res.price}</p>
            {res.url && <a href={res.url} target="_blank" className="text-blue-500 underline">View Product</a>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;

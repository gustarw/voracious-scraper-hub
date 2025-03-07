import React, { useState } from "react";

export const WebScraper = () => {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        throw new Error("Failed to scrape data");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Web Scraper</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to scrape"
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleScrape}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Scraping..." : "Scrape Data"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {data && (
        <div className="mt-4">
          <h3 className="font-bold">Scraped Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

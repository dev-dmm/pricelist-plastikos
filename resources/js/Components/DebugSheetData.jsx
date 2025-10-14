import { useState, useEffect } from 'react';
import { fetchPricelistData } from '../utils/googleSheets';

const DebugSheetData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const sheetData = await fetchPricelistData();
      setData(sheetData);
      console.log('Debug - Full sheet data:', sheetData);
    } catch (err) {
      console.error('Debug - Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading debug data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        Debug: Raw Sheet Data
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Column Names:</h4>
          <div className="bg-accent/30 p-3 rounded text-sm">
            {Object.keys(data[0] || {}).map((col, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{idx}:</span>
                <span className="font-mono">"{col}"</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">First 5 Rows:</h4>
          <div className="space-y-2">
            {data.slice(0, 5).map((row, idx) => (
              <div key={idx} className="bg-accent/30 p-3 rounded text-sm">
                <div className="font-semibold mb-2">Row {idx + 1}:</div>
                {Object.entries(row).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-mono">
                      {value === null ? 'null' : `"${value}"`}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">All Liposuction Rows:</h4>
          {(() => {
            const lipoRows = data.filter(row => 
              row['Επέμβαση'] && row['Επέμβαση'].toLowerCase().includes('λιποαναρρόφηση')
            );
            if (lipoRows.length > 0) {
              return (
                <div className="space-y-2">
                  {lipoRows.map((lipoRow, idx) => (
                    <div key={idx} className="bg-green-50 p-3 rounded text-sm">
                      <div className="font-semibold mb-2">Liposuction Row {idx + 1}:</div>
                      {Object.entries(lipoRow).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-mono">
                            {value === null ? 'null' : `"${value}"`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            }
            return <div className="text-muted-foreground">No liposuction rows found</div>;
          })()}
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">All Body Category Rows:</h4>
          {(() => {
            const bodyRows = data.filter(row => 
              row['Κατηγορία'] && row['Κατηγορία'].toLowerCase().includes('σώμα')
            );
            if (bodyRows.length > 0) {
              return (
                <div className="space-y-2">
                  {bodyRows.slice(0, 10).map((row, idx) => (
                    <div key={idx} className="bg-blue-50 p-3 rounded text-sm">
                      <div className="font-semibold mb-2">Body Row {idx + 1}: {row['Επέμβαση']}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Ιατρός: {row['Αμοιβή Ιατρού (€)'] || 'null'}</div>
                        <div>Αναισθησιολόγος: {row['Αναισθησιολόγος (€)'] || 'null'}</div>
                        <div>Κλινική 1: {row['Κλινική 1 (€)'] || 'null'}</div>
                        <div>Σύνολο: {row['Σύνολο (€)'] || 'null'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return <div className="text-muted-foreground">No body category rows found</div>;
          })()}
        </div>
      </div>
    </div>
  );
};

export default DebugSheetData;

/**
 * Google Sheets Integration Utility
 * 
 * Αυτό το utility βοηθάει να κάνουμε fetch δεδομένα από Google Sheets
 * και να τα μετατρέψουμε σε χρησιμοποιήσιμο JSON format.
 */

/**
 * Fetches data from Google Sheets and returns parsed JSON
 * @param {string} sheetUrl - The Google Sheets URL with gviz format
 * @returns {Promise<Object>} Parsed sheet data
 */
export async function fetchGoogleSheetData(sheetUrl) {
  try {
    console.log('Fetching data from Google Sheets:', sheetUrl);
    
    const response = await fetch(sheetUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log('Raw response received');
    
    // Parse JSONP response
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/);
    
    if (!match || !match[1]) {
      throw new Error('Could not parse JSONP response from Google Sheets');
    }
    
    const jsonData = JSON.parse(match[1]);
    console.log('Parsed JSON data:', jsonData);
    
    if (jsonData.status !== 'ok') {
      throw new Error(`Google Sheets API error: ${jsonData.status}`);
    }
    
    // Transform data to flat format
    const cols = jsonData.table.cols.map(col => col.label);
    console.log('Column names from sheet:', cols);
    
    const transformedData = jsonData.table.rows.map(row => {
      return cols.reduce((acc, colName, idx) => {
        acc[colName] = row.c[idx] ? row.c[idx].v : null;
        return acc;
      }, {});
    });
    
    console.log('Transformed data (first 3 rows):', transformedData.slice(0, 3));
    console.log('All column names found:', Object.keys(transformedData[0] || {}));
    
    return transformedData;
    
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}

/**
 * Creates a Google Sheets URL for JSON data
 * @param {string} sheetId - The Google Sheets ID
 * @param {string} gid - The sheet GID (tab ID)
 * @returns {string} Formatted URL for JSON data
 */
export function createGoogleSheetsUrl(sheetId, gid) {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;
}

/**
 * Filters data by category
 * @param {Array} data - The sheet data
 * @param {string} category - The category to filter by
 * @returns {Array} Filtered data
 */
export function filterByCategory(data, category) {
  return data.filter(row => row['Κατηγορία'] === category);
}

/**
 * Gets unique categories from the data
 * @param {Array} data - The sheet data
 * @returns {Array} Array of unique categories
 */
export function getCategories(data) {
  const categories = [...new Set(data.map(row => row['Κατηγορία']))];
  return categories.filter(cat => cat); // Remove empty/null categories
}

/**
 * Parses a price value that might be a range (e.g., "1000, 2000")
 * @param {string|number} priceValue - The price value from the sheet
 * @returns {Object} Object with min, max, and display values
 */
export function parsePriceRange(priceValue) {
  if (!priceValue) return { min: null, max: null, display: null, isRange: false };
  
  const priceStr = String(priceValue).trim();
  
  // Check if it contains comma (range)
  if (priceStr.includes(',')) {
    const parts = priceStr.split(',').map(p => p.trim());
    if (parts.length === 2) {
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      return {
        min,
        max,
        display: `${min} - ${max}`,
        isRange: true
      };
    }
  }
  
  // Single value
  const value = parseFloat(priceStr);
  return {
    min: value,
    max: value,
    display: value.toString(),
    isRange: false
  };
}

/**
 * Groups procedures with their variations
 * @param {Array} data - The sheet data
 * @returns {Array} Array of procedures with variations
 */
export function getProceduresWithVariations(data) {
  const procedures = [];
  let currentProcedure = null;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const category = row['Κατηγορία'];
    const procedure = row['Επέμβαση'];
    const doctorFee = row['Αμοιβή Ιατρού (€)'];
    
    // If this row has a category and procedure name, it's a main procedure
    if (category && procedure) {
      // Save previous procedure if exists
      if (currentProcedure) {
        procedures.push(currentProcedure);
      }
      
      // Start new procedure
      currentProcedure = {
        category,
        name: procedure,
        description: row['Περιγραφή'],
        doctorFee: parsePriceRange(doctorFee),
        assistantFee: parsePriceRange(row['Βοηθός (€)']),
        anesthesiologistFee: parsePriceRange(row['Αναισθησιολόγος (€)']),
        clinic1Fee: parsePriceRange(row['Κλινική 1 (€)']),
        clinic2Fee: parsePriceRange(row['Κλινική 2 (€)']),
        clinic3Fee: parsePriceRange(row['Κλινική 3 (€)']),
        materialsFee: parsePriceRange(row['Υλικά (€)']),
        total: parsePriceRange(row['Σύνολο (€)']),
        variations: []
      };
    }
    // If this row has no category but has procedure name, it's a variation
    else if (!category && procedure && currentProcedure) {
      currentProcedure.variations.push({
        name: procedure,
        doctorFee: parsePriceRange(doctorFee),
        assistantFee: parsePriceRange(row['Βοηθός (€)']),
        anesthesiologistFee: parsePriceRange(row['Αναισθησιολόγος (€)']),
        clinic1Fee: parsePriceRange(row['Κλινική 1 (€)']),
        clinic2Fee: parsePriceRange(row['Κλινική 2 (€)']),
        clinic3Fee: parsePriceRange(row['Κλινική 3 (€)']),
        materialsFee: parsePriceRange(row['Υλικά (€)']),
        total: parsePriceRange(row['Σύνολο (€)'])
      });
    }
  }
  
  // Don't forget the last procedure
  if (currentProcedure) {
    procedures.push(currentProcedure);
  }
  
  // Recalculate all totals with correct calculations
  return recalculateProcedureTotals(procedures);
}

/**
 * Gets procedures for a specific category (with variations support)
 * @param {Array} data - The sheet data
 * @param {string} category - The category
 * @returns {Array} Array of procedures for the category
 */
export function getProceduresForCategory(data, category) {
  const proceduresWithVariations = getProceduresWithVariations(data);
  return proceduresWithVariations.filter(proc => proc.category === category);
}

/**
 * Gets all procedures with their variations
 * @param {Array} data - The sheet data
 * @returns {Array} Array of all procedures with variations
 */
export function getAllProceduresWithVariations(data) {
  return getProceduresWithVariations(data);
}

/**
 * Example usage for the pricelist sheet
 */
export const PRICELIST_CONFIG = {
  sheetId: '1QBfEP2M-bGS0TfBTgaLV1qxk4623DebB',
  gid: '1585480085',
  url: 'https://docs.google.com/spreadsheets/d/1QBfEP2M-bGS0TfBTgaLV1qxk4623DebB/gviz/tq?tqx=out:json&gid=1585480085'
};

/**
 * Fetches the pricelist data specifically
 * @returns {Promise<Array>} Pricelist data
 */
export async function fetchPricelistData() {
  return await fetchGoogleSheetData(PRICELIST_CONFIG.url);
}

/**
 * Gets procedures for CostEstimatorForm with proper structure
 * @param {Array} data - The sheet data
 * @returns {Object} Procedures organized for the form
 */
export function getProceduresForEstimator(data) {
  const proceduresWithVariations = getAllProceduresWithVariations(data);
  
  const categories = {};
  
  proceduresWithVariations.forEach(procedure => {
    if (!categories[procedure.category]) {
      categories[procedure.category] = [];
    }
    
    // Add main procedure
    categories[procedure.category].push({
      name: procedure.name,
      description: procedure.description,
      hasVariations: procedure.variations.length > 0,
      variations: procedure.variations.map(variation => ({
        name: variation.name,
        priceRange: variation.total ? variation.total : null
      }))
    });
  });
  
  return categories;
}

/**
 * Gets price range display for UI
 * @param {Object} priceRange - The parsed price range object
 * @returns {string} Display string for the price
 */
export function getPriceDisplay(priceRange) {
  if (!priceRange || !priceRange.display) return 'Δεν διαθέσιμο';
  
  if (priceRange.isRange) {
    return `€${priceRange.min} - €${priceRange.max}`;
  }
  
  return `€${priceRange.display}`;
}

/**
 * Gets average price from a range
 * @param {Object} priceRange - The parsed price range object
 * @returns {number|null} Average price or null if not available
 */
export function getAveragePrice(priceRange) {
  if (!priceRange) return null;
  
  if (priceRange.isRange) {
    return Math.round((priceRange.min + priceRange.max) / 2);
  }
  
  return priceRange.min;
}

/**
 * Calculates the correct total price from all components
 * @param {Object} procedure - The procedure object with all fee components
 * @returns {Object} Calculated total with min, max, and display
 */
export function calculateCorrectTotal(procedure) {
  const components = [
    procedure.doctorFee,
    procedure.assistantFee,
    procedure.anesthesiologistFee,
    procedure.clinic1Fee,
    procedure.clinic2Fee,
    procedure.clinic3Fee,
    procedure.materialsFee
  ];

  let minTotal = 0;
  let maxTotal = 0;
  let hasAnyValue = false;

  components.forEach(component => {
    if (component && component.min !== null) {
      hasAnyValue = true;
      minTotal += component.min;
      maxTotal += component.max;
    }
  });

  if (!hasAnyValue) {
    return { min: null, max: null, display: null, isRange: false };
  }

  const isRange = minTotal !== maxTotal;
  
  return {
    min: minTotal,
    max: maxTotal,
    display: isRange ? `${minTotal} - ${maxTotal}` : minTotal.toString(),
    isRange: isRange
  };
}

/**
 * Recalculates all procedure totals with correct calculations
 * @param {Array} procedures - Array of procedures with variations
 * @returns {Array} Procedures with corrected totals
 */
export function recalculateProcedureTotals(procedures) {
  return procedures.map(procedure => {
    // Recalculate main procedure total
    const correctedTotal = calculateCorrectTotal(procedure);
    
    // Recalculate variations totals
    const correctedVariations = procedure.variations.map(variation => ({
      ...variation,
      total: calculateCorrectTotal(variation)
    }));

    return {
      ...procedure,
      total: correctedTotal,
      variations: correctedVariations
    };
  });
}

/**
 * Gets a breakdown of all cost components for a procedure
 * @param {Object} procedure - The procedure object
 * @returns {Array} Array of cost components with their values
 */
export function getCostBreakdown(procedure) {
  const components = [
    { name: 'Ιατρός', value: procedure.doctorFee },
    { name: 'Βοηθός', value: procedure.assistantFee },
    { name: 'Αναισθησιολόγος', value: procedure.anesthesiologistFee },
    { name: 'Κλινική 1', value: procedure.clinic1Fee },
    { name: 'Κλινική 2', value: procedure.clinic2Fee },
    { name: 'Κλινική 3', value: procedure.clinic3Fee },
    { name: 'Υλικά', value: procedure.materialsFee }
  ];

  return components.map(component => ({
    name: component.name,
    min: component.value ? component.value.min : null,
    max: component.value ? component.value.max : null,
    display: component.value ? component.value.display : null,
    isRange: component.value ? component.value.isRange : false,
    hasValue: component.value && component.value.min !== null
  }));
}

/**
 * Gets the total cost breakdown for display
 * @param {Object} procedure - The procedure object
 * @returns {Object} Cost breakdown with total calculation
 */
export function getCostBreakdownWithTotal(procedure) {
  const breakdown = getCostBreakdown(procedure);
  const correctedTotal = calculateCorrectTotal(procedure);
  
  return {
    components: breakdown,
    total: correctedTotal,
    originalTotal: procedure.total
  };
}

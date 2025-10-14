/**
 * Utility για να διαβάζει δεδομένα από Excel αρχείο
 * Χρησιμοποιεί το xlsx library για να parse το Excel file
 */

/**
 * Fetches and parses Excel data from the public folder
 * @returns {Promise<Array>} Parsed Excel data
 */
export async function fetchExcelData() {
  try {
    console.log('Fetching Excel data from public folder...');
    
    const response = await fetch('/Pricelist_Plastikos_Xeirourgos.xlsx');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    console.log('Excel file loaded, size:', arrayBuffer.byteLength);
    
    // Import xlsx dynamically
    const XLSX = await import('xlsx');
    
    // Parse the Excel file
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    console.log('Workbook sheets:', workbook.SheetNames);
    
    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('Raw Excel data (first 5 rows):', jsonData.slice(0, 5));
    
    // Convert to object format with headers
    if (jsonData.length < 2) {
      throw new Error('Excel file has no data or headers');
    }
    
    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);
    
    console.log('Headers:', headers);
    
    const transformedData = dataRows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    }).filter(row => {
      // Filter out completely empty rows
      return Object.values(row).some(value => value !== null && value !== undefined && value !== '');
    });
    
    console.log('Transformed Excel data (first 3 rows):', transformedData.slice(0, 3));
    console.log('Total rows:', transformedData.length);
    
    return transformedData;
    
  } catch (error) {
    console.error('Error fetching Excel data:', error);
    throw error;
  }
}

/**
 * Gets categories from Excel data
 * @param {Array} data - The Excel data
 * @returns {Array} Unique categories
 */
export function getCategoriesFromExcel(data) {
  const categories = [...new Set(data.map(row => row['Κατηγορία']).filter(Boolean))];
  console.log('Categories from Excel:', categories);
  return categories;
}

/**
 * Gets procedures for a specific category from Excel data
 * @param {Array} data - The Excel data
 * @param {string} category - The category to filter by
 * @returns {Array} Procedures for the category
 */
export function getProceduresForCategoryFromExcel(data, category) {
  return data.filter(row => row['Κατηγορία'] === category);
}

/**
 * Gets all procedures with variations from Excel data
 * @param {Array} data - The Excel data
 * @returns {Array} Procedures with variations
 */
export function getAllProceduresWithVariationsFromExcel(data) {
  const procedures = [];
  let currentProcedure = null;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const category = row['Κατηγορία'];
    const procedure = row['Επέμβαση'];
    
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
        doctorFee: parsePriceRange(row['Αμοιβή Ιατρού (€)']),
        assistantFee: parsePriceRange(row['Βοηθός (€)']),
        anesthesiologistFee: parsePriceRange(row['Αναισθησιολόγος (€)']),
        clinic1Fee: parsePriceRange(row['Κλινική 1 (€)']),
        clinic2Fee: parsePriceRange(row['Κλινική 2 (€)']),
        clinic3Fee: parsePriceRange(row['Κλινική 3 (€)']),
        materialsFee: parsePriceRange(row['Υλικά (€)']),
        total: parsePriceRange(row['Σύνολο (€)']),
        variations: []
      };
    } else if (!category && procedure && currentProcedure) {
      // This is a variation of the current procedure
      currentProcedure.variations.push({
        name: procedure,
        description: row['Περιγραφή'],
        doctorFee: parsePriceRange(row['Αμοιβή Ιατρού (€)']),
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
 * Parses price range from Excel cell value
 * @param {any} value - The cell value
 * @returns {Object} Parsed price range
 */
function parsePriceRange(value) {
  if (!value) return { min: null, max: null, display: null, isRange: false };

  const priceStr = String(value).trim();

  // Handle special materials format like "Στρογγυλά: 800, Αντομικά: 1300"
  if (priceStr.includes(':') && priceStr.includes(',')) {
    const parts = priceStr.split(',').map(p => p.trim());
    const prices = [];
    
    parts.forEach(part => {
      if (part.includes(':')) {
        const priceMatch = part.match(/(\d+)/);
        if (priceMatch) {
          prices.push(parseFloat(priceMatch[1]));
        }
      }
    });
    
    if (prices.length >= 2) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return { 
        min, 
        max, 
        display: `${min} - ${max}`, 
        isRange: true,
        variations: prices.map(p => ({ price: p, name: parts.find(part => part.includes(p.toString()))?.split(':')[0]?.trim() || '' }))
      };
    }
  }

  if (priceStr.includes(',')) {
    const parts = priceStr.split(',').map(p => p.trim());
    if (parts.length === 2) {
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      if (!isNaN(min) && !isNaN(max)) {
        return { min, max, display: `${min} - ${max}`, isRange: true };
      }
    }
  }
  
  const valueNum = parseFloat(priceStr);
  if (isNaN(valueNum)) {
    return { min: null, max: null, display: null, isRange: false };
  }
  
  return { min: valueNum, max: valueNum, display: valueNum.toString(), isRange: false };
}

/**
 * Calculates the correct total price from all components
 * @param {Object} procedure - The procedure object with all fee components
 * @returns {Object} Calculated total with min, max, and display
 */
function calculateCorrectTotal(procedure) {
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
function recalculateProcedureTotals(procedures) {
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

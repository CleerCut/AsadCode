/**
 * CSV Export Utility
 * Handles CSV generation, escaping, and browser download
 */

/**
 * Escape CSV value to handle commas, quotes, and newlines
 * @param {any} value - Value to escape
 * @returns {string} - Escaped CSV value
 */
export const escapeCSVValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  // Convert to string
  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Convert array of objects to CSV string
 * @param {Array<Object>} rows - Array of data objects
 * @param {Array<string>} headers - Array of header names (keys from rows)
 * @returns {string} - CSV formatted string
 */
export const generateCSV = (rows, headers) => {
  if (!rows || rows.length === 0) {
    return "";
  }

  // Create header row
  const headerRow = headers.map((header) => escapeCSVValue(header)).join(",");

  // Create data rows
  const dataRows = rows.map((row) => {
    return headers.map((header) => escapeCSVValue(row[header] || "")).join(",");
  });

  // Combine header and data rows
  return [headerRow, ...dataRows].join("\n");
};

/**
 * Download CSV file in browser
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Filename for download
 */
export const downloadCSV = (csvContent, filename) => {
  // Create blob with CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Format date to YYYYMMDD format (UTC)
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export const formatDateForFilename = (date) => {
  const d = date || new Date();
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

/**
 * Sanitize campaign name for filename
 * @param {string} campaignName - Campaign name
 * @returns {string} - Sanitized filename-safe string
 */
export const sanitizeFilename = (campaignName) => {
  if (!campaignName) return "campaign";
  // Replace spaces with underscores, remove special characters
  return campaignName
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .substring(0, 100); // Limit length
};


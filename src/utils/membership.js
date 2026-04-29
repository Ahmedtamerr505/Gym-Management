export const checkAccessStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = today - expiry;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "ACTIVE"; // Not expired yet
  if (diffDays <= 3) return "GRACE_PERIOD"; // Within 3 days
  return "EXPIRED"; // Deny access
};
export const sortByDay = (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom);

export const sortByTime = (a, b) => {
  const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
  const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
  return durationB - durationA;
};

export const sortByPrice = (a, b) => b.basePrice - a.basePrice;

export const generatePaymentReference = () => {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `ref_${timestamp}_${randomString}`;
};

export const isAtLeast31DaysAgo = (dateInput: string) => {
  const inputDate: Date = new Date(dateInput);
  const now: Date = new Date();

  const diffInMs = now.getTime() - inputDate.getTime();
  const daysDiff = diffInMs / (1000 * 60 * 60 * 24);

  return daysDiff >= 31;
};

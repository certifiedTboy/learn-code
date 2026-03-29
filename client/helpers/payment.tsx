export const generatePaymentReference = () => {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `ref_${timestamp}_${randomString}`;
};

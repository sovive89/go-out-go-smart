export const normalizePhoneBR = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length >= 12) {
    return digits.slice(2, 13);
  }
  return digits.slice(0, 11);
};

const isValidDDD = (ddd: string) => {
  const n = Number(ddd);
  return Number.isInteger(n) && n >= 11 && n <= 99;
};

export const isValidPhoneBR = (value: string) => {
  const digits = normalizePhoneBR(value);
  if (digits.length !== 11) return false;

  const ddd = digits.slice(0, 2);
  const ninth = digits[2];

  return isValidDDD(ddd) && ninth === '9';
};

export const formatPhoneBR = (value: string) => {
  const digits = normalizePhoneBR(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const maskPhoneBR = (value: string) => {
  const digits = normalizePhoneBR(value);
  if (digits.length < 11) return formatPhoneBR(digits);
  return `(${digits.slice(0, 2)}) 9****-${digits.slice(7, 11)}`;
};

type ConvertToLocaleParams = {
  amount: number;
  currency_code: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
  without_symbol?: boolean;
};

export const formatPrice = ({
  amount,
  currency_code,
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
  locale = "en-US",
  without_symbol = false,
}: ConvertToLocaleParams) => {
  const amountAware = convertToDecimal(amount, currency_code);
  return new Intl.NumberFormat(locale, {
    style: without_symbol ? undefined : "currency",
    currency: currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amountAware);
};

// Add currencies that don't need to be divided by 100
const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
];

export const convertToDecimal = (amount: number, currency_code: string) => {
  const divisor = noDivisionCurrencies.includes(currency_code?.toLowerCase())
    ? 1
    : 100;

  return Math.floor(amount) / divisor;
};

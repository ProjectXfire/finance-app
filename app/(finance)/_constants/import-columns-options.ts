export const requiredColumnsOptions = ['amount', 'date', 'payee'] as const;
export const columnsOptions = ['amount', 'date', 'payee'];

type RequiredColumn = (typeof requiredColumnsOptions)[number];

export type ImportColum = {
  [key in RequiredColumn]: any;
};

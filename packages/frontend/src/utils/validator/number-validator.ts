export const numberValidator = (value: string): number => {
  const number = Number(value);
  return (isNaN(number) || value[0] === '0') ? 0 : number;
}
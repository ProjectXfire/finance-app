'use client';

import { FormControl, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '..';

type Data = {
  label: string;
  value: string;
  key: string;
};

interface Props {
  placeholder?: string;
  onChange: (value: string) => void;
  data: Data[];
  defaultValue?: string | null;
}

function CustomSelect({
  onChange,
  data,
  placeholder = 'Select an item...',
  defaultValue,
}: Props): JSX.Element {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue ?? ''}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {data.map((d) => (
          <SelectItem key={d.key} value={d.value}>
            {d.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default CustomSelect;

import { Alert, AlertDescription, AlertTitle } from '..';

interface Props {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

function CustomAlert({ title, description, variant = 'default', icon }: Props): JSX.Element {
  return (
    <Alert variant={variant}>
      {icon && icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
export default CustomAlert;

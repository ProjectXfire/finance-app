import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components';

interface Props {
  title: string;
  children: React.ReactNode;
}

function ChartCard({ children, title }: Props): JSX.Element {
  return (
    <Card className='mb-2'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
export default ChartCard;

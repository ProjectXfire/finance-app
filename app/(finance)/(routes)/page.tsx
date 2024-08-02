import { DashboardContainer, DataCharts, DataGrid } from '../_components';

export default function DashboardPage(): JSX.Element {
  return (
    <DashboardContainer>
      <DataGrid />
      <DataCharts />
    </DashboardContainer>
  );
}

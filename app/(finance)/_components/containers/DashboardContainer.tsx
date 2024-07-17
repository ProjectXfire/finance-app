'use client';

import { useGetAccounts } from '@/core/finance/services/client';

function DashboardContainer(): JSX.Element {
  const { data, error, isLoading } = useGetAccounts();

  if (error)
    return (
      <section>
        <p>{error.message}</p>
      </section>
    );

  return (
    <section>
      <ul>
        {data?.map((acc) => (
          <li key={acc.id}>{acc.name}</li>
        ))}
      </ul>
    </section>
  );
}
export default DashboardContainer;

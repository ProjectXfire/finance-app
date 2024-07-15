import { MainHeader, MainContainer } from '../_components';

interface Props {
  children: React.ReactNode;
}

function FinanceLayput({ children }: Props): JSX.Element {
  return (
    <>
      <MainHeader />
      <MainContainer>{children}</MainContainer>
    </>
  );
}
export default FinanceLayput;

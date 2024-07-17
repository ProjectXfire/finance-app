import { MainHeader, MainContainer, AccountSheet } from '../_components';

interface Props {
  children: React.ReactNode;
}

function FinanceLayput({ children }: Props): JSX.Element {
  return (
    <>
      <MainHeader />
      <AccountSheet />
      <MainContainer>{children}</MainContainer>
    </>
  );
}
export default FinanceLayput;

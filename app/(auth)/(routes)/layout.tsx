import { ToggleTheme } from '@/shared/components';
import { AuthContainer } from '../_components';

interface Props {
  children: React.ReactNode;
}

function AuthLayout({ children }: Props) {
  return (
    <AuthContainer>
      <ToggleTheme />
      {children}
    </AuthContainer>
  );
}
export default AuthLayout;

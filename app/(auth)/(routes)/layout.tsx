import { AuthContainer } from '../_components';

interface Props {
  children: React.ReactNode;
}

function AuthLayout({ children }: Props) {
  return <AuthContainer>{children}</AuthContainer>;
}
export default AuthLayout;

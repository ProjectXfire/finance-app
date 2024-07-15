import { ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs';
import { AuthHeader } from '@/app/(auth)/_components';
import { Loading } from '@/shared/components';

function SignInPage(): JSX.Element {
  return (
    <>
      <AuthHeader
        title='Welcome Back! 🏢'
        subtitle='Log in or Create account to get back to your dashboard!'
      />
      <ClerkLoaded>
        <SignIn />
      </ClerkLoaded>
      <ClerkLoading>
        <Loading />
      </ClerkLoading>
    </>
  );
}
export default SignInPage;

import { AuthHeader } from '@/app/(auth)/_components';
import { Loading } from '@/shared/components';
import { ClerkLoaded, ClerkLoading, SignUp } from '@clerk/nextjs';

function SignUpPage() {
  return (
    <>
      <AuthHeader
        title='Welcome Back! 🏢'
        subtitle='Log in or Create account to get back to your dashboard!'
      />
      <ClerkLoaded>
        <SignUp />
      </ClerkLoaded>
      <ClerkLoading>
        <Loading />
      </ClerkLoading>
      ;
    </>
  );
}
export default SignUpPage;

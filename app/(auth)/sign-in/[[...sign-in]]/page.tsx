// we do [[...sign-in]] for the folder name so that it will catch all of the sign in redirect

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </main>
  );
};

export default SignInPage;

// we do [[...sign-in]] for the folder name so that it will catch all of the sign in redirect

import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </main>
  );
};

export default SignUpPage;

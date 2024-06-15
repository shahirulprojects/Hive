import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// createRouteMatcher allows us to match specific routes that we want to make public or private
// protected routes usually means that we need to login to go there
const protectedRoutes = createRouteMatcher([
  "/",
  "/upcoming",
  "/previous",
  "/recordings",
  "/personal-room",
  "/meeting(.*)", // /meeting(.*) is used so that it will match all the meeting routes
]);

// passing in the auth and the request
export default clerkMiddleware((auth, req) => {
  // if the request is directing to the protected routes, we will protect it
  if (protectedRoutes(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

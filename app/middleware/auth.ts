export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  // If trying to access protected route without auth
  if (!isAuthenticated.value && to.path !== "/") {
    return navigateTo("/");
  }

  // If already authenticated and trying to access login page
  if (isAuthenticated.value && to.path === "/") {
    return navigateTo("/dashboard");
  }
});

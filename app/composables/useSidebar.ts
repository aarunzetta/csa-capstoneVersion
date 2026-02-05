import { onMounted, onUnmounted } from "vue";

export const useSidebar = () => {
  const getDefaultState = () => {
    if (typeof window !== "undefined") {
      // Closed on mobile/tablet (< 1024px), open on desktop (>= 1024px)
      return window.innerWidth >= 1024;
    }
    return false; // Default to closed for SSR
  };

  const isOpen = useState("sidebar-open", () => getDefaultState());

  const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
  };

  const closeSidebar = () => {
    isOpen.value = false;
  };

  const openSidebar = () => {
    isOpen.value = true;
  };

  const handleResize = () => {
    if (typeof window !== "undefined") {
      // Auto-close on mobile/tablet, auto-open on desktop
      isOpen.value = window.innerWidth >= 1024;
    }
  };

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize);
    }
  });

  return {
    isOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
};

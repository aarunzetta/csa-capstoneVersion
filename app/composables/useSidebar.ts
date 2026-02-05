import { onMounted } from "vue";

export const useSidebar = () => {
  const getDefaultState = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
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
      isOpen.value = window.innerWidth >= 1024;
    }
  };

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  return {
    isOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
};

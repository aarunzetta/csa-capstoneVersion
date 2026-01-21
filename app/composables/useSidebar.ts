export const useSidebar = () => {
  const isOpen = useState("sidebar-open", () => true);

  const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
  };

  const closeSidebar = () => {
    isOpen.value = false;
  };

  const openSidebar = () => {
    isOpen.value = true;
  };

  return {
    isOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
};

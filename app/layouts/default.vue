<template>
  <div class="flex min-h-screen">
    <aside class="sticky top-0 h-screen overflow-y-auto">
      <layoutSidebar />
    </aside>
    <div class="flex-1 flex flex-col min-w-0">
      <header class="sticky top-0 z-10">
        <layoutHeader />
      </header>
      <main class="flex-1 overflow-y-auto">
        <div class="bg-secondary-dark text-white p-6 min-h-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

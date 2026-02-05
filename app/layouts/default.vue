<template>
  <div class="flex min-h-screen">
    <aside class="lg:sticky top-0 h-screen overflow-y-auto">
      <layoutSidebar />
    </aside>
    <div class="flex-1 flex flex-col min-w-0">
      <main class="flex-1">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

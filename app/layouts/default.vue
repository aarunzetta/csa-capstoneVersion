<template>
  <div class="flex min-h-screen">
    <aside>
      <layoutSidebar />
    </aside>
    <div class="flex-1 flex flex-col">
      <main class="">
        <layoutHeader />
        <slot />
      </main>
    </div>
  </div>
</template>

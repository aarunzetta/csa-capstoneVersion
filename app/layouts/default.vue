<template>
  <div class="flex min-h-screen">
    <aside>
      <layoutSidebar />
    </aside>
    <div class="flex-1 flex flex-col">
      <main>
        <layoutHeader />
        <div
          class="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white p-6"
        >
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

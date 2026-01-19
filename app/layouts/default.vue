<template>
  <div class="flex min-h-screen">
    <aside>
      <layoutSidebar />
    </aside>
    <div class="flex-1 flex flex-col">
      <main>
        <layoutHeader />
        <div class="bg-primary text-white p-6 h-full"><slot /></div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UInput } from "#build/components";

const projectType = "JS";

type SprintTask = {
  id: number;
  title: string;
  type: "story" | "bug";
};

type SprintStatus = {
  id: number;
  name: string;
  tasks: SprintTask[];
};

const statuses = ref<SprintStatus[]>([
  {
    id: 1,
    name: "Todo",
    tasks: [
      {
        id: 1,
        title: "Complete Jira App",
        type: "story",
      },
    ],
  },
  {
    id: 2,
    name: "In Progress",
    tasks: [],
  },
  {
    id: 3,
    name: "Done",
    tasks: [],
  },
]);

const newStatus = ref("");
const addNewInput = ref<ComponentPublicInstance<typeof UInput> | null>(null);
const isAddNewStatusVisible = ref(false);

function cancelNewStatus() {
  isAddNewStatusVisible.value = false;
  newStatus.value = "";
}

function addNewStatus() {
  statuses.value.push({
    id: statuses.value.length + 1,
    name: newStatus.value,
    tasks: [],
  });
  cancelNewStatus();
}

async function toggleAddNewStatus() {
  isAddNewStatusVisible.value = true;
  await nextTick();
  if (addNewInput.value) {
    addNewInput.value.input.focus();
  }
}

// Create Task
const [isCreateNewTaskOpen, toggleNewTask] = useToggle(false);

const newTask = ref({
  title: "",
});

function createNewTask() {
  statuses.value[0].tasks?.push({
    id: Math.floor(Math.random() * 10000),
    title: newTask.value.title,
    type: "story",
  });
  newTask.value.title = "";
  toggleNewTask(false);
}
</script>

<template>
  <div class="m-10">
    <div class="container mx-auto mb-10">
      <UButton color="blue" @click="toggleNewTask(true)">Create</UButton>
      <UModal v-model="isCreateNewTaskOpen">
        <div class="p-6">
          <h1>Create New Task</h1>
          <UInput v-model="newTask.title" />
          <div class="mt-4">
            <UButton type="button" @click="createNewTask">Save</UButton>
          </div>
        </div>
      </UModal>
    </div>
    <div class="container mx-auto">
      <div class="flex gap-1 mb-8">
        <div
          class="rounded-full p-[1px] w-8 h-8 bg-blue-500 font-semibold flex items-center justify-center"
        >
          PL
        </div>
        <div class="w-max rounded-full border border-slate-300">
          <Icon
            name="material-symbols:account-circle"
            color="#626F86"
            size="2em"
          />
        </div>
      </div>
      <div class="flex gap-4">
        <div
          v-for="status in statuses"
          :key="status.id"
          class="w-60 border border-slate-300 rounded p-2"
        >
          <h1 class="font-semibold">
            {{ status.name }}
          </h1>
          <div class="py-4 space-y-4">
            <div
              v-for="task in status.tasks"
              :key="task.id"
              class="border border-slate-300 rounded p-2 hover:shadow-sm hover:bg-slate-100 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                {{ task.title }}
              </div>

              <div class="mt-4">
                <span v-if="task.type === 'story'" class="mr-1 font-bold">
                  S
                </span>
                {{ projectType }}-{{ task.id }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-60">
          <div v-if="isAddNewStatusVisible">
            <UInput ref="addNewInput" type="text" v-model="newStatus" />
            <div class="mt-2 flex gap-2">
              <button type="button" @click="addNewStatus">Save</button>
              <button type="button" @click="cancelNewStatus">Cancel</button>
            </div>
          </div>
          <div v-else>
            <button type="button" @click="toggleAddNewStatus">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

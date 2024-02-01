<script setup lang="ts">
import type { UInput } from "#build/components";
import type { SprintStatus, SprintTask } from "~/utils/types";

const projectType = "JS";

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

// drag drop
const draggeditem = ref<SprintTask | null>(null);
const isDragging = ref(false);

function dragStart(e: DragEvent, item: SprintTask) {
  draggeditem.value = item;
  isDragging.value = true;
}

function drop(e: DragEvent, statusToDrop: SprintStatus) {
  e.preventDefault();

  // Prevent droping to same column
  const oldStatus = statuses.value.find((c) =>
    c.tasks.find((m) => m.id === draggeditem.value?.id)
  );

  if (oldStatus && oldStatus.id === statusToDrop.id) return;

  // Add new item to new status column
  const z = { ...statusToDrop };
  const i = statuses.value.findIndex((a) => a.id === z.id);
  if (i !== -1 && draggeditem.value) {
    statuses.value[i].tasks.push({
      id: Math.floor(Math.random() * 1000),
      title: draggeditem.value.title,
      type: draggeditem.value.type,
    });
  }

  draggeditem.value = null;
}

function isDropzoneVisible(status: SprintStatus) {
  const oldStatus = statuses.value.find((c) =>
    c.tasks.find((m) => m.id === draggeditem.value?.id)
  );

  if (oldStatus && oldStatus.id === status.id) return false;
  return true;
}

const dragStatusId = computed(
  () =>
    statuses.value.find((s) =>
      s.tasks.find((z) => z.id === draggeditem.value?.id)
    )?.id
);
</script>

<template>
  <div class="m-10">
    <div class="container mx-auto mb-10">
      <UButton color="blue" @click="toggleNewTask(true)">Create</UButton>
      <UModal v-model="isCreateNewTaskOpen">
        <div class="p-6">
          <h1 class="mb-2">Create New Task</h1>
          <UInput v-model="newTask.title" />
          <div class="mt-4">
            <UButton type="button" @click="createNewTask">Save</UButton>
          </div>
        </div>
      </UModal>
    </div>
    <div class="container mx-auto">
      <div class="flex gap-2 mb-8">
        <div
          class="rounded-full p-[1px] w-8 h-8 bg-blue-500 font-semibold flex items-center justify-center text-sm"
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
          :key="`status-${status.id}`"
          class="w-60 border border-slate-300 rounded p-2"
        >
          <h1 class="font-semibold mb-4">
            {{ status.name }}
          </h1>
          <div class="relative h-screen">
            <div
              v-if="isDragging && status.id !== dragStatusId"
              class="bg-blue-200 absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center rounded-md"
              dropzone
              @dragover.prevent
              @drop="drop($event, status)"
            >
              Dragging
            </div>
            <div class="space-y-4">
              <div
                v-for="task in status.tasks"
                :key="`task-${task.id}`"
                class="border border-slate-300 rounded p-2 hover:shadow-sm hover:bg-slate-100 cursor-pointer"
                draggable="true"
                @dragstart="dragStart($event, task)"
                @dragend="isDragging = false"
                @dragover.prevent
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

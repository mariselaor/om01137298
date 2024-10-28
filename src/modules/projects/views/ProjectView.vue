<template>
  <div class="p-8 overflow-x-auto w-full">
    <h2>Nombre Proyecto: {{ proyectoActual?.nombre }}</h2>

    <div class="mt-4">
      <input v-model="nuevaTarea" type="text" placeholder="Agregar nueva tarea" class="input input-bordered mr-2" />
      <button @click="agregarTarea" class="btn btn-primary">Agregar</button>
    </div>

    <div v-if="mostrarMensaje" class="mt-2 alert alert-error">
      Se ha alcanzado el límite de 10 tareas.
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Completada</th>
          <th>Tarea</th>
          <th>Fecha y hora de Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tarea, index) in proyectoActual?.tareas" :key="tarea.id">
          <td>{{ index + 1 }}</td>
          <td>
            <input 
              type="checkbox" 
              v-model="tarea.completada" 
              @change="actualizarTarea(proyectoActual.id, tarea.id, tarea.completada)" 
            />
          </td>
          <td>{{ tarea.nombre }}</td>
          <td>{{ tarea.fecha }}</td>
          <td>
            <button @click="eliminarTarea(proyectoActual.id, tarea.id)" class="btn btn-sm btn-error">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4">
      <p>Progreso: {{ proyectoActual?.progreso }}%</p>
      <progress :value="proyectoActual?.progreso" class="progress progress-primary w-56" max="100"></progress>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProyectosStore } from '../store/projects.store';

const proyectosStore = useProyectosStore();
const route = useRoute();
const nuevaTarea = ref('');
const mostrarMensaje = ref(false);

const proyectoActual = computed(() =>
  proyectosStore.proyectos.find((proyecto) => proyecto.id === route.params.id)
);

const agregarTarea = () => {
  if ((proyectoActual.value?.tareas.length || 0) >= 10) {
    mostrarMensaje.value = true;
    setTimeout(() => {
      mostrarMensaje.value = false;
    }, 1000); 
    return;
  }

  if (nuevaTarea.value.trim()) {
    proyectosStore.agregarTarea(route.params.id as string, nuevaTarea.value.trim());
    nuevaTarea.value = '';
  }
};

const actualizarTarea = (idProyecto: string, idTarea: string, completada: boolean) => {
  proyectosStore.actualizarTarea(idProyecto, idTarea, completada);
};

const eliminarTarea = (idProyecto: string, idTarea: string) => {
  proyectosStore.eliminarTarea(idProyecto, idTarea);
};
</script>

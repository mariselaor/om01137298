import { defineStore } from 'pinia';

export const useProyectosStore = defineStore('proyectos', {
  state: () => ({
    proyectos: [] as {
      id: string;
      nombre: string;
      tareas: { id: string; nombre: string; completada: boolean; fecha: string }[];
      progreso: number;
    }[],
  }),
  actions: {
    agregarProyecto(nombreProyecto: string) {
      const proyecto = {
        id: Date.now().toString(),
        nombre: nombreProyecto,
        tareas: [],
        progreso: 0,
      };
      this.proyectos.push(proyecto);
    },
    agregarTarea(idProyecto: string, nombreTarea: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        const nuevaTarea = {
          id: Date.now().toString(),
          nombre: nombreTarea,
          completada: false,
          fecha: new Date().toLocaleString(),
        };
        proyecto.tareas.push(nuevaTarea);
        this.actualizarProgreso(idProyecto);
      }
    },
    eliminarTarea(idProyecto: string, idTarea: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        proyecto.tareas = proyecto.tareas.filter((tarea) => tarea.id !== idTarea);
        this.actualizarProgreso(idProyecto);
      }
    },
    actualizarTarea(idProyecto: string, idTarea: string, completada: boolean) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        const tarea = proyecto.tareas.find((t) => t.id === idTarea);
        if (tarea) {
          tarea.completada = completada;
          this.actualizarProgreso(idProyecto); // Recalcula el progreso
        }
      }
    },
    actualizarProgreso(idProyecto: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        const completadas = proyecto.tareas.filter((tarea) => tarea.completada).length;
        proyecto.progreso = (proyecto.tareas.length > 0) ? (completadas / proyecto.tareas.length) * 100 : 0;
      }
    },
  },
});

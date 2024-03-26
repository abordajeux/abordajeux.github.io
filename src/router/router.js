import { createRouter, createWebHistory } from "vue-router"; // Import individual functions from vue-routerimport Welcome from '@/components/Welcome.vue'
import Welcome from "@/components/Welcome.vue";
import NotFound from "@/components/NotFound.vue";
import Projects from "@/components/Projects.vue";
import Events from "@/components/Events.vue";
import Contact from "@/components/Contact.vue";
import Statuts from "@/components/Statuts.vue";

const routes = [
  { path: "/", component: Welcome },
  { path: "/projects", component: Projects },
  { path: "/events", component: Events },
  { path: "/contact", component: Contact },
  { path: "/statuts", component: Statuts },
  // Define a wildcard route for 404
  { path: "/:pathMatch(.*)*", component: NotFound },
];
export const appRouter = createRouter({ history: createWebHistory(), routes });

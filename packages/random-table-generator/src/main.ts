import { registerModule } from "@planarally/module-api";
import RandomTable from "./RandomTable.vue";

registerModule("random-table-generator", {
  component: RandomTable,
  name: "Random Table Generator",
});

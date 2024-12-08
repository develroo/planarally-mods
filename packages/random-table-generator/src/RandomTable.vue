<template>
  <div>
    <h1>Random Table Generator</h1>

    <section>
      <h2>Upload CSV</h2>
      <input type="file" @change="onFileUpload" accept=".csv" />
    </section>

    <section>
      <h2>Set Parameters</h2>
      <div>
        <label for="dataColumn">Select Data Column:</label>
        <select v-model="selectedDataColumn" id="dataColumn">
          <option v-for="(header, index) in headers" :key="index" :value="header">{{ header }}</option>
        </select>

        <label for="rollColumn">Select Roll Column (optional):</label>
        <select v-model="selectedRollColumn" id="rollColumn">
          <option v-for="(header, index) in headers" :key="index" :value="header">{{ header }}</option>
        </select>

        <label>
          <input type="checkbox" v-model="useAutoRange" /> Automatically Generate Roll Ranges
        </label>
      </div>
    </section>

    <section>
      <h2>Reorder Entries</h2>
      <ul>
        <li v-for="(row, index) in sortableData" :key="index">
          {{ row }}
        </li>
      </ul>
    </section>

    <section>
      <h2>Generate Random Entry</h2>
      <button @click="generateRandomEntry">Generate Random Entry</button>
      <p v-if="randomEntry">Random Entry: {{ randomEntry }}</p>
    </section>
  </div>
</template>

<script lang="ts">
import Papa from "papaparse";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "RandomTable",
  setup() {
    const headers = ref<string[]>([]);
    const data = ref<any[]>([]);
    const sortableData = ref<any[]>([]);
    const selectedDataColumn = ref("");
    const selectedRollColumn = ref("");
    const useAutoRange = ref(false);
    const randomEntry = ref<string | null>(null);

    const onFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          headers.value = Object.keys(results.data[0]);
          data.value = results.data;
          sortableData.value = [...results.data];
        },
        error: (err) => console.error(err),
      });
    };

    const generateRandomEntry = () => {
      if (sortableData.value.length === 0) {
        randomEntry.value = "No data available.";
        return;
      }
      const randomIndex = Math.floor(Math.random() * sortableData.value.length);
      randomEntry.value = JSON.stringify(sortableData.value[randomIndex]);
    };

    return {
      headers,
      data,
      sortableData,
      selectedDataColumn,
      selectedRollColumn,
      useAutoRange,
      randomEntry,
      onFileUpload,
      generateRandomEntry,
    };
  },
});
</script>

<style scoped>
/* Add any custom styles */
</style>

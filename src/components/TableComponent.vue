<template>
  <div id="tableComponent">
    <div class="container-fluid">
      <b-pagination
        v-if="tableItems.length"
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
      <b-table
        :items="paginatedItems"
        :fields="tableFields"
        bordered
        hover
      ></b-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "tableComponent",
  props: {
    tableItems: {
      type: Array,
      required: true,
    },
    tableFields: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    totalRows() {
      return this.tableItems.length;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.tableItems.slice(start, end);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

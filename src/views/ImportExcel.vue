<template>
  <div class="importExcel">
    <div class="d-flex flex-column align-items-center">
      <form>
        <div class="form-group">
          <label for="exampleFormControlFile1">Import Excel</label>
          <input
            type="file"
            class="custom-file-input"
            id="exampleFormControlFile1"
            @change="handleFileUpload"
          />
        </div>
      </form>
      <TableComponent
        :tableItems="tableData && tableData.length ? tableData : []"
        :tableFields="fields && fields.length ? fields : []"
        v-if="tableData.length"
      ></TableComponent>
    </div>
  </div>
</template>

<script lang="js">
import TableComponent from "@/components/TableComponent.vue";
import excelHelper from "../helper/excelHelper.js"
import impoerCreateHelper from "../helper/importCreateHelper.js"

export default {
  name: "importExcel",
  components: {
    TableComponent,
  },
  data() {
    return {
      tableData: [],
      fields: [
        { "key": "orderNo", "label": "Order No" },
        { "key": "orderTime", "label": "Order Time" },
        { "key": "marketplace", "label": "Marketplace" },
        { "key": "productName", "label": "Product Name" },
        { "key": "profit", "label": "Profit" }
      ],
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      excelHelper.ReadExcelFile(file).then((value) => {
        this.tableData = impoerCreateHelper.GetExcelToJson(value.contents)
        console.log("tableData", this.tableData);  // ตรวจสอบค่า tableData
        console.log("fields", this.fields);     // ตรวจสอบค่า fields
      })
    },
  },
};
</script>
<style scoped lang="scss">
.custom-file-input {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  &::file-selector-button {
    padding: 0.375rem 0.75rem;
    margin: -0.375rem -0.75rem;
    -webkit-margin-end: 0.75rem;
    margin-inline-end: 0.75rem;
    color: #495057;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out;
  }

  &::file-selector-button:hover {
    background-color: #dde0e3;
  }
}
</style>

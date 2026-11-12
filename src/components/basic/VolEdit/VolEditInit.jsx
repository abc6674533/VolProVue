import { setFormAuditReadonly } from "@/components/basic/ViewGrid/ViewGridReadonly.jsx";
export default function (props, currentRow) {
  const dataConfig = {
    currentAction: {
      value: "Update",
    },
    currentRow: {
      value: currentRow,
    },
    defaultFormReadonlyFields: {
      value: props.formOptions.flat().filter((x) => {
        return x.readonly || x.disabled;
      }).map(x=>{return x.field}),
    },
  };
  const tableInfo = {
    name: props.tableName,
  };
  return setFormAuditReadonly(
    tableInfo,
    props.formFields,
    props.formOptions,
    dataConfig
  );
}

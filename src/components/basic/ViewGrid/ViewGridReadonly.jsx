import { checkFormReadonly } from "@/uitils/formEditAuditCheck.js";
export const initReadonly = (proxy, props, dataConfig) => {
  props.editFormOptions.forEach((ops) => {
    ops.forEach((x) => {
      if (x.readonly || x.disabled) {
        dataConfig.defaultFormReadonlyFields.value.push(x.field);
      }
    });
  });

  //设置表单只读
  const setFormReadonly = (readonly) => {
    props.editFormOptions.flat().forEach((ops) => {
        if (!dataConfig.defaultFormReadonlyFields.value.includes(ops.field)) {
          ops.readonly = !!readonly;
        }
    });
    dataConfig.detailOptions.columns.forEach((x) => {
      x.readonly = !!readonly;
    });
    dataConfig.detailOptions.buttons.forEach((x) => {
      x.hidden = !!readonly;
    });
    if (props.details.length) {
      props.details.forEach((x) => {
        if (x.columns) {
          x.columns.forEach((col) => {
            col.readonly = !!readonly;
          });
          x.buttons.forEach((btn) => {
            btn.hidden = !!readonly;
          });
        }
      });
    }
  };

  return { setFormReadonly };
};
//审批表单只读
export const setFormAuditReadonly = (
  tableInfo,
  editFormFields,
  editFormOptions,
  dataConfig
) => {
  // if (!dataConfig.defaultFormReadonlyFields.value.length) {
  //   return;
  // }
  const b =
    dataConfig.currentAction.value == "Add" || dataConfig.isCopyClick?.value
      ? false
      : checkFormReadonly(
          dataConfig.currentRow.value,
          tableInfo,
          editFormFields,
          editFormOptions
        );
       // console.log(b)
  editFormOptions.forEach((ops) => {
    ops.forEach((x) => {
      if (!dataConfig.defaultFormReadonlyFields.value.includes(x.field)) {
        x.readonly = b;
      }
    });
  });
  dataConfig.boxButtons?.value?.forEach((x) => {
    if (x.value == "save") {
      x.hidden = b;
    }
  });
  dataConfig.detailOptions?.buttons?.forEach((x) => {
    x.hidden = b;
  });
  return b;
};

export const initAuthFields = (proxy, props) => {
  let arr = props.table.name.split("/");
  let tableName = props.tableName?.toLowerCase();
  let _auth = (proxy.base.getItem("authFields") || []).find((c) => {
    return (c.name + "").toLowerCase() === tableName;
  });
  initDetailAuthFields(proxy, props);
  if (!_auth || !_auth.fields.length) {
    return;
  }
  props.formOptions.flat().forEach((op) => {
    op.hidden = _auth.fields.indexOf(op.field) === -1;
  });
};

const initDetailAuthFields = (proxy, props) => {
  const detail = props.detail;
  try {
    if (!detail.columns || !detail.columns.length) {
      return;
    }
    let _auth = (proxy.base.getItem("authFields") || []).find((c) => {
      return (c.name + "").toLowerCase() === (detail.table + "").toLowerCase();
    });
    if (!_auth || !_auth.fields.length) {
      return;
    }
    detail.columns.forEach((col) => {
      if (!col.hidden) {
        col.hidden = _auth.fields.indexOf(col.field) === -1;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

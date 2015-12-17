mixin = (obj, expansion) => {
  Object.keys(expansion).forEach((k) =>
    obj[k] = expansion[k]
  );
};
function fix(options, apis, models) {
  const apiPrefix = '/api/services/app/';
  var apiPath = apiPrefix;
  //options.extraArgs.UpdateApi for edit template, like User/Update
  if (options.extraArgs.UpdateApi) {
    apiPath = `${apiPrefix}${options.extraArgs.UpdateApi}`;
    options.log(apiPath);
  } else {
    console.log(`Please set --UpdateApi option, like 'ng g ng-alain:tpl abp-edit edit -m=sys -t=users --UpdateApi=User/Update'.`);
    return;
  }

  const api = apis[apiPath];
  options.log(api);

  var sfDtoSchema = {
    properties: {}
  };

  // TODO number类型
  var uiOrder = {
    string: [],
    boolean: [],
    array: []
  }; //先string，再boolean，最后array

  if (api.put && api.put.parameters && api.put.parameters.length > 0) {

    const refVal = api.put.parameters[0].schema['$ref'];
    var mName = refVal.substring(refVal.lastIndexOf('/') + 1, refVal.length);
    var putModel = models[mName];
    sfDtoSchema.required = putModel.required;

    for (const key in putModel.properties) {
      if (key === 'id') {
        continue;
      }
      if (putModel.properties.hasOwnProperty(key)) {
        const prop = putModel.properties[key];

        if (!uiOrder.hasOwnProperty(prop.type)) {
          uiOrder[prop.type] = [];
        }
        uiOrder[prop.type].push(key);

        var title = prop.description || key;
        var element = {};
        element.title = title;
        switch (prop.type) {
          case 'string':
            element.type = prop.type;
            element.minLength = prop.minLength;
            element.maxLength = prop.maxLength;
            break;
          case 'array':
            element.type = 'string';
            element.ui = {
              widget: 'checkbox',
              checkAll: true,
              asyncData: '//() => this.userService.getRoles().pipe(map(r => r.items.map(i => ({label: i.displayName,value: i.name}))))',
              default: []
            };
            break;
          default:
            element.type = prop.type;
            break;
        }
        sfDtoSchema.properties[key] = element;
      }
    }
  }
  options.uiOrderTpl = JSON.stringify([...uiOrder.string, ...uiOrder.boolean, ...uiOrder.array], null, 4).replace(/"/g, '\'');
  options.SFDtoTpl = JSON.stringify(sfDtoSchema, null, 4).replace(/"/g, '\'');
}

module.exports = {
  fix
};

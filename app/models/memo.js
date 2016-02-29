exports.definition = {
  config: {
    columns: {
      "id": "integer",
      "contents": "text",
      "priority": "text"
    },
    adapter: {
      type: "restapi",
      collection_name: "memo",
      "idAttribute": "id"
    },
    "URL": Alloy.CFG.API_URL,
    //"headers": {
    //},
    //"parentNode": "memos",
    "debug": 1
  },
  extendModel: function(Model) {
    _.extend(Model.prototype, {
      // extended functions and properties go here
    });

    return Model;
  },
  extendCollection: function(Collection) {
    _.extend(Collection.prototype, {
      // extended functions and properties go here

      // For Backbone v1.1.2, uncomment the following to override the
      // fetch method to account for a breaking change in Backbone.
      /*
       fetch: function(options) {
       options = options ? _.clone(options) : {};
       options.reset = true;
       return Backbone.Collection.prototype.fetch.call(this, options);
       }
       */
      comparator: function(data) {
        return (0 - data.get('priority').length);
      }
    });

    return Collection;
  }
};

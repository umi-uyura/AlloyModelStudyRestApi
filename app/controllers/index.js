'use strict';

var dialogs = require('alloy/dialogs');

var memos = Alloy.Collections.memo;
var API_URL = Alloy.CFG.API_URL;

function doOpen() {
  memos.fetch({
    success : function(models, response){
      Ti.API.debug('memo fetch() - success = ' + models + ' / ' + response);
    },
    error : function(models, response){
      Ti.API.debug('memo fetch() - error = ' + models + ' / ' + response);
    }
  });
}

function addText() {
  var txt = $.memoText.getValue();
  var params = {
    contents: txt,
    priority: ''
  };

  var m = Alloy.createModel('memo', params);

  m.save({}, {
    success : function(model, response){
      Ti.API.debug('memo save-add() - success = ' + model + ' / ' + response);
    },
    error : function(model, response){
      Ti.API.debug('memo save-add() - error = ' + model + ' / ' + response);
    }
  });
  memos.add(m);

  $.memoText.setValue('');
}

function clickItem(e) {
  var secIdx = e.sectionIndex;
  var itemIdx = e.itemIndex;
  var itemId = e.itemId;
  var text = $.memoList.sections[e.sectionIndex].items[e.itemIndex].properties.title;

  var opt = {
    title: 'Action for: ' + text,
    options: [
      'Favorite',
      'Delete',
      'Cancel'
    ],
    cancel: 2,
    destructive: 1
  };

  var optionDialog = Ti.UI.createOptionDialog(opt);
  optionDialog.addEventListener('click', function(e) {
    switch (e.index) {
    case 0:
      var m = memos.where({id: itemId});
      if (m.length) {
        var priority = '*' + m[0].get('priority');
        m[0].set({priority: priority});
        m[0].save({}, {
          success : function(model, response){
            Ti.API.debug('memo save-update() - success = ' + model + ' / ' + response);
          },
          error : function(model, response){
            Ti.API.debug('memo save-update() - error = ' + model + ' / ' + response);
          }
        });
        memos.sort();
      }
      break;
    case 1:
      dialogs.confirm({
        title: 'Do you want to delete ?',
        message: '"' + text + '"',
        callback: function() {
          var m = memos.where({id: itemId});
          if (m.length) {
            m[0].destroy({
              success : function(model, response){
                Ti.API.debug('memo destroy() - success = ' + model + ' / ' + response);
              },
              error : function(model, response){
                Ti.API.debug('memo destroy() - error = ' + model + ' / ' + response);
              }
            });
          }
        }
      });
      break;
    case 2:
      // Cancel
      break;
    default:
      Ti.API.error('Unknown action = ' + e.index);
      break;
    }
  });
  optionDialog.show();
}

$.index.open();

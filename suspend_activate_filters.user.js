// ==UserScript==
// @id             iitc-plugin-suspendfilters
// @name           IITC plugin: Suspend or activate all filters.
// @author         hurqalia22
// @category       Info
// @version        0.1.8.20151007.001
// @namespace      https://github.com/Hurqalia/suspend_activate_filters
// @updateURL      https://github.com/Hurqalia/suspend_activate_filters/raw/master/suspend_activate_filters.meta.js
// @downloadURL    https://github.com/Hurqalia/suspend_activate_filters/raw/master/suspend_activate_filters.user.js
// @installURL     https://github.com/Hurqalia/suspend_activate_filters/raw/master/suspend_activate_filters.user.js
// @description    [hurqalia22-2015-10-08-001] Suspend or activate all filters.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
        if(typeof window.plugin !== 'function') window.plugin = function() {};
        plugin_info.buildName = 'hurqalia22';
        plugin_info.dateTimeVersion = '20151007.001';
        plugin_info.pluginId = 'suspendfilters';

        // PLUGIN START ////////////////////////////////////////////////////////

        // use own namespace for plugin
        window.plugin.suspendfilters                  = function() {};
        window.plugin.suspendfilters.KEY_CURRENT      = 'plugin-suspendfilters-current';
        window.plugin.suspendfilters.KEY_STORAGE      = 'plugin-suspendfilters-datas';
        window.plugin.suspendfilters.KEY_STORAGE_NAME = 'default';
        window.plugin.suspendfilters.KEY              = {key: window.plugin.suspendfilters.KEY_STORAGE, field: 'filtersObj'};
        window.plugin.suspendfilters.filtersObj       = {};

        // STORAGE //////////////////////////////////////////////////////////

        // update the localStorage datas
        window.plugin.suspendfilters.saveStorage = function() {
                localStorage[plugin.suspendfilters.KEY_STORAGE] = JSON.stringify(window.plugin.suspendfilters.filtersObj);
        };

        // load the localStorage datas
        window.plugin.suspendfilters.loadStorage = function() {
                if (localStorage[plugin.suspendfilters.KEY_STORAGE]) {
                        window.plugin.suspendfilters.filtersObj = JSON.parse(localStorage[plugin.suspendfilters.KEY_STORAGE]);
                }
        };
    
        // update the localStorage default preset
        window.plugin.suspendfilters.saveCurrent = function() {
                localStorage[plugin.suspendfilters.KEY_CURRENT] = window.plugin.suspendfilters.KEY_STORAGE_NAME;
        };

        // load the localStorage default preset
        window.plugin.suspendfilters.loadCurrent = function() {
                if (localStorage[plugin.suspendfilters.KEY_CURRENT]) {
                        window.plugin.suspendfilters.KEY_STORAGE_NAME = localStorage[plugin.suspendfilters.KEY_CURRENT];
                }
        };

        // FUNCTIONS ////////////////////////////////////////////////////////
        // save selection as preset
        window.plugin.suspendfilters.filtersToPreset = function() {
            var listfilters     = {};
            listfilters.filters = {};
            listfilters.maps    = {};
            var reswueReg = /.*\s(Main Portals|Main Links|Main Polys|Alerts|Agent Tracker|Layer [A-F] \w+)/; 
            
                $('.leaflet-control-layers-overlays > label').each(function() {
                        var cbox   = $(this).find('input');
                        var clabel = $(this).find('span');
                        var tclabel = $.trim($(clabel).text());
                        if (reswueReg.test(tclabel)) {
                                var rtclabel = reswueReg.exec(tclabel);
                                tclabel = rtclabel[1];
                        }
                        listfilters.filters[tclabel] = $(cbox).is(':checked') ? true : false;
                });

                $('.leaflet-control-layers-base > label').each(function() {
                        var cbox   = $(this).find('input');
                        var clabel = $(this).find('span');
                        var tclabel = $.trim($(clabel).text());
                        listfilters.maps[tclabel] = (tclabel == localStorage['iitc-base-map']) ? true : false;
                });

                window.plugin.suspendfilters.filtersObj[window.plugin.suspendfilters.KEY_STORAGE_NAME] = listfilters;
                window.plugin.suspendfilters.saveStorage();
        };

        // set preset
        window.plugin.suspendfilters.setPreset = function() {
                var reswueReg = /.*\s(Main Portals|Main Links|Main Polys|Alerts|Agent Tracker|Layer [A-F] \w+)/;
                $('.leaflet-control-layers-overlays > label').each(function() {
                        var cbox    = $(this).find('input');
                        var clabel  = $(this).find('span');
                        var tclabel = $.trim($(clabel).text());
                        if (reswueReg.test(tclabel)) {
                                var rtclabel = reswueReg.exec(tclabel);
                                tclabel = rtclabel[1];
                        }
                        var cboxsts = $(cbox).is(':checked') ? true : false;
                        if (window.plugin.suspendfilters.filtersObj[window.plugin.suspendfilters.KEY_STORAGE_NAME].filters[tclabel] != cboxsts) {
                                $(cbox).click();
                        }
                });
                $('.leaflet-control-layers-base > label').each(function() {
                        var cbox    = $(this).find('input');
                        var clabel  = $(this).find('span');
                        var tclabel = $.trim($(clabel).text());
                        var cboxsts = $(cbox).is(':checked') ? true : false;
                        if (window.plugin.suspendfilters.filtersObj[window.plugin.suspendfilters.KEY_STORAGE_NAME].maps[tclabel] != cboxsts) {
                                $(cbox).click();
                        }
                });
        };

        // select preset
        window.plugin.suspendfilters.selectPreset = function() {
            if ($('#changePresetButton').val() !== window.plugin.suspendfilters.KEY_STORAGE_NAME) {
                window.plugin.suspendfilters.KEY_STORAGE_NAME = $('#changePresetButton').val();
                window.plugin.suspendfilters.setPreset();
                window.plugin.suspendfilters.saveCurrent();
            }
        };

        // create new preset
        window.plugin.suspendfilters.createPreset = function() {
                var html = '<div class="">'
                        + '<div>Give a name to your preset</div>'
                        + 'name : <input id="new_name_preset" type="text"></input>'
                        + '</div>';

                dialog({
                        html: html,
                        id: 'plugin-suspendfilters-new-name',
                        dialogClass: '',
                        title: 'new preset name',
                        buttons:{
                                'OK' : function() {
                                        var new_name = $('#new_name_preset').val();
                                        var rexp = /^[\+0-9a-zA-Z_-]+$/;
                                        if (rexp.test(new_name)) {
                                                window.plugin.suspendfilters.KEY_STORAGE_NAME = new_name;
                                                window.plugin.suspendfilters.filtersToPreset();
                                                window.plugin.suspendfilters.setPopup();
                                        } else {
                                                alert('alphanumeric string only');
                                        }
                                        $(this).dialog('close');
                                },
                                'Cancel' : function(){
                                        $(this).dialog('close');
                                }
                        }
                });
        };

        // clean preset
        window.plugin.suspendfilters.cleanPreset = function() {
                if (Object.keys(window.plugin.suspendfilters.filtersObj).length) {
                        var html = '<div class="">'
                                + '<div>Select preset to clean</div>'
                                + '<form id="deselect-presel-name">';

                        $.each(window.plugin.suspendfilters.filtersObj, function(k, r) {
                                if (k != 'default') {
                                        html += '<input value="' + k + '" type="checkbox">' + k + '</input><br />';
                                }
                        });
                        html += '</form></div>';

                        dialog({
                                html: html,
                                id: 'plugin-suspendfilters-select-name',
                                dialogClass: '',
                                title: 'Select preset to clean',
                                buttons:{
                                        'OK' : function() {
                                                var do_save = false;
                                                $.each($("#deselect-presel-name input[type='checkbox']:checked"), function() {
                                                        var prst_name = $(this).val();
                                                        if ((prst_name !== '') && (prst_name !== 'default')) {
                                                                if (window.plugin.suspendfilters.filtersObj[prst_name] !== 'undefined') {
                                                                        delete window.plugin.suspendfilters.filtersObj[prst_name];
                                                                        do_save = true;
                                                                }
                                                        }
                                                });
                                                if (do_save) {
                                                        window.plugin.suspendfilters.saveStorage();
                                                        window.plugin.suspendfilters.KEY_STORAGE_NAME = 'default';
                                                        window.plugin.suspendfilters.setPreset();
                                                        window.plugin.suspendfilters.saveCurrent();
                                                        window.plugin.suspendfilters.setPopup();
                                                }
                                                $(this).dialog('close');
                                        },
                                        'Cancel' : function(){
                                                $(this).dialog('close');
                                        }
                                }
                        });
                } else {
                        alert('no preset defined.');
                }
        };
        // init setup
        window.plugin.suspendfilters.setup  = function() {
                window.plugin.suspendfilters.loadCurrent();
                window.plugin.suspendfilters.loadStorage();
                if (window.plugin.suspendfilters.filtersObj[window.plugin.suspendfilters.KEY_STORAGE_NAME] === undefined) {
                        window.plugin.suspendfilters.filtersToPreset(); // save default filters list on loading
                        window.plugin.suspendfilters.saveCurrent();     // save default config
                } 
                else {
                        window.plugin.suspendfilters.setPreset();       // set saved preset filters
                }
                window.plugin.suspendfilters.addButtons();
                window.plugin.suspendfilters.setPopup();
        };

        // toolbox menu
        window.plugin.suspendfilters.addButtons = function() {
                $('#toolbox').after('<div id="suspendfilters-toolbox" style="padding:3px;"></div>');
                $('#suspendfilters-toolbox')
                        .append(' <strong>Preset filters : </strong><select onchange="window.plugin.suspendfilters.selectPreset()" id="changePresetButton" title="Change preset"></select><br />')
                        .append(' <a onclick="window.plugin.suspendfilters.createPreset()">New</a>&nbsp;&nbsp;')
                        .append(' <a onclick="window.plugin.suspendfilters.filtersToPreset()">Save</a>&nbsp;&nbsp;')
                        .append(' <a onclick="window.plugin.suspendfilters.cleanPreset()">Clean</a>&nbsp;&nbsp;');
        };

        window.plugin.suspendfilters.setPopup = function() {
          $('#changePresetButton').find('option').remove();
          if (Object.keys(window.plugin.suspendfilters.filtersObj).length) {
            $.each(window.plugin.suspendfilters.filtersObj, function(k, r) {
              $('#changePresetButton').append($('<option>', { value : k, text : k }));      
            });
            $('#changePresetButton').val(window.plugin.suspendfilters.KEY_STORAGE_NAME);
          }  
        };

        // runrun
        var setup =  window.plugin.suspendfilters.setup;

        setup.info = plugin_info; //add the script info data to the function as a property
        if(!window.bootPlugins) window.bootPlugins = [];
        window.bootPlugins.push(setup);
        // if IITC has already booted, immediately run the 'setup' function
        if(window.iitcLoaded && typeof setup === 'function') {
                setup();
        }

    // PLUGIN END ////////////////////////////////////////////////////////    
} // WRAPPER END ////////////////////////////////////////////////////////    

var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);



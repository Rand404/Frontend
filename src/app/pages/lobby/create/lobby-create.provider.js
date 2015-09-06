(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.config(LobbyCreateConfig)
  app.provider('LobbyCreate', LobbyCreate);

  /** @ngInject */
  function LobbyCreateConfig($stateProvider, LobbyCreateProvider) {
    /*
      Since the steps might change over time, it's much easier
      to add the nested states here with a loop instead of
      manually in app.route.js

      It also makes sense to add them in this separate file
      because they're nested states
    */
    LobbyCreateProvider.wizardSteps = ['format', 'map', 'league', 'whitelist', 'mumble'];

    for (var i = 0; i < LobbyCreateProvider.wizardSteps.length; i++) {
      var stepName = LobbyCreateProvider.wizardSteps[i];
      $stateProvider.state('lobby-create.' + stepName, {
        url: '/' + stepName,
        views: {
          "wizard-step": {
            templateUrl: 'app/pages/lobby/create/step-' + stepName + '.html'
          }
        }
      });
    }
  }  

  /** @ngInject */
  function LobbyCreate() {

    var lobbyCreateProvider = {};

    lobbyCreateProvider.wizardSteps = {};

    /** @ngInject */
    var lobbyCreateService = function(Websocket) {

      var lobbySettingsList = {
        regions: ["Europe","North America","Asia"],
        formats: ['6v6','highlander'],
        rulesets: ['UGC','ETF2L',3966],
        leagues: ['UGC','ETF2L'],
        maps: ['cp_process','koth_viaduct']
      }

      lobbyCreateService.create = function(lobbySettings) {
        console.log(lobbySettings)
        Websocket.emit('lobbyCreate',
          JSON.stringify(lobbySettings),
          function(data) {
            var response = JSON.parse(data);
            console.log(response);
          }
        );
      }

      lobbyCreateService.getSettingsList = function() {
        return lobbySettingsList;
      }

      lobbyCreateService.getSteps = function() {
        return lobbyCreateProvider.wizardSteps;
      }

      return lobbyCreateService;
    }

    lobbyCreateProvider.$get = lobbyCreateService;

    return lobbyCreateProvider;
  }

})();
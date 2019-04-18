function EpisodeCounter(StarWarsService, $rootScope) {
    const ctrl = this;
    
    ctrl.getEpisode = function() {
        return StarWarsService.getEpisode();
    };
//$locationChangeSuccess is a built in?  gets next episode if location changes successfully calls on service's Get episode
// has access to getEpisode since service is passed in as a parameter
    $rootScope.$on("$locationChangeSuccess", function(value) {
        ctrl.getEpisode()
    });
  }
  
  angular.module('StarWarsCrawler').component('episodeCounter', {
    template: `
        <h2> Movie #{{$ctrl.getEpisode()}} </h2>
    `, // or use templateUrl
    controller: EpisodeCounter,
});
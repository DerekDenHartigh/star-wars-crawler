function Crawler(StarWarsService, $q, $timeout, $rootScope) {
    const ctrl = this;
// initializes an empty crawler array to be filled later by response data, shows nothing yet, per ng-if
    ctrl.$onInit = function() {
        ctrl.crawler = [];
        ctrl.show = false;
    };

    $rootScope.$on("$locationChangeSuccess", function(value) {
        ctrl.crawler = [];
        ctrl.show = false;
// waits for the promise of fulfilled getStarWarsCrawler() before showing anything, won't show anything if that function is rejected
        ctrl.getStarWarsCrawler()
        .then( _ => ctrl.show = true ); 
    });

    ctrl.getStarWarsCrawler = () => {
        // call star wars API
        // attach to template one by one
        return $q(function(resolve, reject) {
             StarWarsService.callStarWarsAPI()
            .then( (response) => {
                ctrl.crawler.push(`Episode ${response.data.episode_id}: ${response.data.title}`);

                let crawlerData = response.data.opening_crawl.split('\n');
                ctrl.addToCrawler(crawlerData, 0, resolve);
            });   
        });
    }
// redirects to the service's nextEpisode function
    ctrl.nextEpisode = () => {
        StarWarsService.nextEpisode();
    }
// redirects to the service's previousEpisode function
    ctrl.previousEpisode = () => {
        StarWarsService.previousEpisode();
    }
// crawlerData is an array of the opening crawl from the response data where each item of the array is a string and is seperated whenever a \n is encountered
// index starts at 0, then is incremented every .8s, adding a new line
// resolve... is a callback function, not sure what it does though... I don't see it defined anywhere, maybe it acts like a break?
// the .then is a response to the data being pushed onto the crawlerData array successfully in .8s, it increments the index# so that when it calls back the crawler function, it will display the next line
    ctrl.addToCrawler = (crawlerData, index, resolve) => {

        if ( index === crawlerData.length ) {
            $timeout( () => {
                resolve();
            }, 800)
        } else {
            $timeout( () => {
                ctrl.crawler.push(crawlerData[index]);
            }, 800)
            .then( _ => {
                index++;
            
                ctrl.addToCrawler(crawlerData, index, resolve)
             })
        }
    }
  }
/** the onlything I don't quite recognize here is the track by $index rather 
  *than whatever random tracker it gets assigned by default
  *I think that it prevent's the display from re-rendering existing lines 
*/ 

  angular.module('StarWarsCrawler').component('crawler', {
    template: `
    
        <p ng-repeat="text in $ctrl.crawler track by $index">{{text}}</p>
        <p ng-if="$ctrl.show">
            <button ng-click="$ctrl.previousEpisode()">Previous Episode</button> 
            <button ng-click="$ctrl.nextEpisode()">Next Episode</button> 
        </p>

    `, // or use templateUrl
    controller: Crawler,
});
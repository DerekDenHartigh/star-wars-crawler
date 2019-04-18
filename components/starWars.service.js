function StarWarsService($location, $http) {
    const service = this;
// getEpisode() sets episode to 1, I'm not sure exactly what the number. is about, parseInt selects the numbers from the URL string, then location is set by hash()?
    service.getEpisode = () => {
        // Default to the good one
        let episode = 1;

        let hash =  Number.parseInt($location.hash());
// if the # set by the hash is validated, i.e. 1 through 9, then episode is set as the hash
        if ( service.validateEpisode(hash) ) {
            episode = hash;
        }
// episode number is returned, 1 by default, or whatever then hash is as by the next/previous episode buttons
        return episode;
    };
//sets URL location at the # to current episode# + 1, so if on ep 5, $location.hash(5 + 1) rolls out episode 6 summary
    service.nextEpisode = () => {
        $location.hash(service.getEpisode() + 1);
    }
// same thing as above comment, but -1 to current episodes #
    service.previousEpisode = () => {
        $location.hash(service.getEpisode() - 1);
    }
//number argument here = hash from getEpisode, set as URLs #(number), 1 by default, returns numbe if it is between 0 and 9
    service.validateEpisode = (number) => {
        return Number.isInteger(number) && (number > 0) && (number < 9);
    };

    service.callStarWarsAPI = (episode) => {
// if the episode is undefined (why not use ===undefined here?) or episode isn't validated via validateEpisode?, episode is from service.getEpisode - which is defaulted to 1
        if ( typeof episode =='undefined' || !service.validateEpisode(episode) ) {
            episode = service.getEpisode();
        }
//returns the JSON file from the specified URL w/ variable # at the end corresponding to a different episode
        return $http.get('https://swapi.co/api/films/' + episode);
    };

}

angular.module('StarWarsCrawler')
.service('StarWarsService', ['$location', '$http', StarWarsService])
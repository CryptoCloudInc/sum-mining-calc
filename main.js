
let app = angular.module('app-calculator', []);


app.controller('mainController', function($scope, $http){

//<!-- Set block reward below -->
    $scope.reward = 100;
    $scope.difficulty = 0;

    $scope.hashingPower = 1;
    $scope.machineWattage = 1600;
    $scope.powerCost = 0.12;

    $scope.sumcoin = {
        time: Date.now(),
        exchangerates: {
            usd: 0,
            gbp: 0,
            eur: 0
        }
    };

    $scope.hashingUnitOptions = {
        availablehashingUnits: [
            {value: 1, name: 'H/s'},
            {value: 1000, name: 'KH/s'},
            {value: 1000000, name: 'MH/s'},
            {value: 1000000000, name: 'GH/s'},
            {value: 1000000000000, name: 'TH/s'},

        ],
        selectedHashingUnit: {value: 1000000000, name: 'GH/s'}
    };

    $http.get('https://rates.slicewallet.org/api/rates').then(function (response) {

        let fgc = response.data;

        $scope.sumcoin.exchangerates.usd = parseFloat(cdr.USD.code.n.replace(',',''));
        $scope.sumcoin.exchangerates.gbp = parseFloat(cdr.bpi.GBP.rate.replace(',',''));
        $scope.sumcoin.exchangerates.eur = parseFloat(cdr.bpi.EUR.rate.replace(',',''));

    });

    $http.get('http://sumexplorer.com/api/getdifficulty').then(function (response) {
        $scope.difficulty = parseFloat(response.data);
    });

    $scope.getSUMPerDay_Exact = function () {
        return 86400 / ($scope.difficulty * (Math.pow(2,48)/65535) / ($scope.hashingPower * $scope.hashingUnitOptions.selectedHashingUnit.value)) * $scope.reward;
    };

    $scope.getSUMPerDay = function () {
        let temp = $scope.getSUMPerDay_Exact();
        return temp.toPrecision(2);
    };

    $scope.getUSDPerDay = function () {
        let temp = $scope.getSUMPerDay_Exact();
        temp *= $scope.sumcoin.exchangerates.usd;
        return temp.toFixed(2);
    };

    $scope.getGBPPerDay = function () {
        let temp = $scope.getSUMPerDay_Exact();
        temp *= $scope.sumcoin.exchangerates.gbp;
        return temp.toFixed(2);
    };

    $scope.getEURPerDay = function () {
        let temp = $scope.getSUMPerDay_Exact();
        temp *= $scope.sumcoin.exchangerates.eur;
        return temp.toFixed(2);
    };

    $scope.getPowerCostPerDay = function () {
        let temp = $scope.machineWattage * $scope.powerCost / 1000 * 24;
        return temp.toFixed(2);
    };

    $scope.getProfitPerDay = function () {
        let temp = $scope.getUSDPerDay() - $scope.getPowerCostPerDay();
        return temp.toFixed(2);
    };

});

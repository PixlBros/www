window.OWNER_ADDRESS = "0xBf4fA9dcA7a9C696fbab2841eA3B8239B6e56c77";
window.NFT_CONTRACT_ADDRESS = "0x70d32faeaa5d78c69f81be6dea581b45f74ca931";
window.FACTORY_CONTRACT_ADDRESS = "0xaFc7170D8cb3B14894CDB939Bb25eED429E0738A";
window.NETWORK = "live"

$(function () {
    $(".pixl-owner-text").text(window.OWNER_ADDRESS);
    $(".pixl-nft-address-text").text(window.NFT_CONTRACT_ADDRESS);
    $(".pixl-factory-address-text").text(window.FACTORY_CONTRACT_ADDRESS);

    //https://rinkeby.etherscan.io/address/0x5780bb857fcb24aad266e17f0fc7169d5aab0ee1
    if (window.NETWORK == "rinkeby") {
        $(".pixl-nft-opensea-link").attr("href", "http://rinkeby.opensea.io");
        $(".pixl-nft-etherscan-link").attr("href", "https://rinkeby.etherscan.io/address/" + window.NFT_CONTRACT_ADDRESS);
        $(".pixl-factory-etherscan-link").attr("href", "https://rinkeby.etherscan.io/address/" + window.FACTORY_CONTRACT_ADDRESS);
    } else {
        $(".pixl-nft-opensea-link").attr("href", "https://opensea.io/collection/pixlbros");
        $(".pixl-nft-etherscan-link").attr("href", "https://etherscan.io/address/" + window.NFT_CONTRACT_ADDRESS);
        $(".pixl-factory-etherscan-link").attr("href", "https://etherscan.io/address/" + window.FACTORY_CONTRACT_ADDRESS);
    }
});


var interval = setInterval(
    (element,$$) => {
        console.log("Buttons: " + ($$(".y3zKF").length));
        $$(".y3zKF")[(Math.floor(Math.random() * $$(".y3zKF").length))].click();
        if ($$(".y3zKF").length < 10) {
            element.scrollTop = element.scrollHeight;
        }
    },
    (Math.floor(Math.random() * 15500) + 10000),
    $$("div.isgrP")[0],$$);
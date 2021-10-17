const NFT_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_count",
                "type": "uint256"
            }
        ],
        "name": "buy",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    }, {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "tokenOfOwnerByIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }, {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }, {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];
//
const nftAddress = "0x5780BB857Fcb24aAD266e17F0Fc7169D5aab0eE1";
const nftAddressRinkeby = "0x5780BB857Fcb24aAD266e17F0Fc7169D5aab0eE1";

$(function () {
    $("#mint").click(async function () {
        await buy()
    });

    $("#btn-wallet").click(async function () {
        getAccount();
    });
});

// request access to the user's MetaMask account
function getAccount() {
    if (typeof window.ethereum !== 'undefined') {
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
            ethereum.request({method: 'eth_requestAccounts'})
                .then(() => {
                    console.log("Ethereum enabled");
                    web3.eth.getAccounts(function (err, acc) {
                        if (err != null) {
                            console.log("There was an error fetching your accounts");
                            self.setStatus("There was an error fetching your accounts");
                            return;
                        }
                        setAccount(acc);
                        setMinting(false);
                        /*if (acc.length > 0) {
                            console.log(acc);
                            if (window.ethereum.networkVersion == "1")
                                $("#btn-wallet").text("Main: " +
                                    acc[0].substr(0, 5) + "..." +
                                    acc[0].substr(acc[0].length - 5, 5));
                            else if (window.ethereum.networkVersion == "4") {
                                $("#btn-wallet").text("Rinkeby: " +
                                    acc[0].substr(0, 5) + "..." +
                                    acc[0].substr(acc[0].length - 5, 5));
                            } else {
                                $("#btn-wallet").text("Not supported");
                            }
                        }*/
                    });
                })
                .catch(() => {
                    console.warn('User didn\'t allow access to accounts.');
                    waitLogin();
                });
        } else {
            console.log("Non-Ethereum browser detected. You should consider installing MetaMask.");
        }
    }
}

function setAccount(acc){
    if (acc.length > 0) {
        console.log(acc);
        window.account=acc;
        if (window.ethereum.networkVersion == "1")
            $("#btn-wallet").text("Main: " +
                acc[0].substr(0, 5) + "..." +
                acc[0].substr(acc[0].length - 5, 5));
        else if (window.ethereum.networkVersion == "4") {
            $("#btn-wallet").text("Rinkeby: " +
                acc[0].substr(0, 5) + "..." +
                acc[0].substr(acc[0].length - 5, 5));
        } else {
            $("#btn-wallet").text("Not supported");
        }
    }
}
async function getPixlBros() {
    if (typeof window.ethereum !== 'undefined') {
        const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const contract = new ethers.Contract(
            window.ethereum.networkVersion == "1" ? nftAddress :
                window.ethereum.networkVersion == "4" ? nftAddressRinkeby : "", NFT_ABI, provider);

        let broIds = [];
        try {
            const balance = await contract.balanceOf(account);
            for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
                const tokenId = await contract.tokenOfOwnerByIndex(account, tokenIndex);
                broIds.push(tokenId.toString());
            }
        } catch (e) {
            console.log(e);
        }
        renderBroIds(broIds);
    }
}

function renderBroIds(ids) {
    let src = $("#container-bros");
    src.empty();
    for (let i of ids) {
        src.append("<img src=\"optimized-images/100x100/" + i + ".png\"" +
            " data-toggle=\"tooltip\" " +
            " data-html=\"true\" " +
            " title=\"<span><img class='p-2' src='optimized-images/200x200/" + i + ".png'/><br/><b>Bro #" + i + "</b></span>\"" +
            "/>");
    }
}

async function buy() {
    if (typeof window.ethereum !== 'undefined' && typeof window.account!=='undefined') {
        setMinting(true);
        let quantity = $("#quantity").val();
        const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
        setAccount([account]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(window.ethereum.networkVersion == "1" ? nftAddress :
            window.ethereum.networkVersion == "4" ? nftAddressRinkeby : "", NFT_ABI, signer);
        const total = (quantity * 0.08).toString();
        try {
            const transaction = await contract.buy(quantity,
                {
                    from: account,
                    value: ethers.utils.parseEther(total),
                    gasLimit: 1500000
                });
            await transaction.wait();
            const totalSupply = await contract.totalSupply();
            //setStatusAlert(null);
            console.log(totalSupply.toString());
        } catch (e) {
            console.log(`Error: ${e.message}`);
            setMinting(false);
        }
        setMinting(false);
        getPixlBros();
    } else {
        //console.log('Please connect with MetaMask.');
        if(window.confirm("Please connect to your Web3 provider!")){
            await getAccount();
        }
    }
}

function setMinting(disable) {
    $("#mint").prop("disabled", disable);
    $("#mint").empty();
    if (disable) {
        $("#mint").append("<img src=\"css/bars-200px.gif\" style=\"width: 40px;height: 40px;\">");
        $("#container-bros").empty();
    } else {
        $("#mint").append("<span height=\"40px\">mint</span>");
    }
}
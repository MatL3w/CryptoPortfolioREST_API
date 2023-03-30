export const getTokenInfo = async (name)=>{
    const assetName = name.toLowerCase();
    const crypto = {
        //name,
        // address:,
        // tvl,
        // category,
        // symbol,
        // logo,
        // url,
        // mcap,
        // price,
    };
    let found;
    await fetch("https://api.llama.fi/protocols", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    })
    .then((result) => result.json())
    .then((data) => {
        found = data.find((ele) => {
        return ele.name.toLowerCase() === assetName;
        });
        if (!found) {
        found = data.find((ele) => {
            return ele.symbol.toLowerCase() === assetName;
        });
        }
        crypto.address = found.address.includes(":")? found.address: "ethereum:" + found.address;
        crypto.name = found.name;
        crypto.tvl = found.tvl;
        crypto.category = found.category;
        crypto.symbol = found.symbol;
        crypto.logo = found.logo;
        crypto.url = found.url;
        crypto.mcap = found.mcap;
        return fetch(`https://coins.llama.fi/prices/current/${crypto.address}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
    })
    .then((result) => result.json())
    .then((data) => {
        const key = Object.keys(data.coins)[0];
        crypto.price = data.coins[key].price;
    })
    .catch((err) => {});
    return crypto;
};
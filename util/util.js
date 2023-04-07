export const getTokenInfo = async (name,quantity)=>{
    const crypto = {
      nameTag: name.toLowerCase(),
      quantity: Number.parseFloat(quantity),
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
            return ele.name.toLowerCase() === crypto.nameTag;
        });
        if (!found) {
            found = data.find((ele) => {
                return ele.symbol.toLowerCase() === crypto.nameTag;
            });
        }
        if (!found) {
            const error = new Error("There is no asset with this nameTag!");
            error.expectedError = true;
            error.statusCode = 422;
            throw error;
        };
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
        crypto.totalValue = crypto.price *crypto.quantity;
    })
    .catch((err) => {
        if(!err.expectedError){
            const error = new Error("Fetching data problem.");
            error.statusCode = 422;
            throw error;
        }
        throw err;
    });
    return crypto;
};
export const checkForValidationErrors = (errors,message)=>{
    if (!errors.isEmpty()) {
      const error = new Error(message);
      error.statusCode = 422;
      throw error;
    }    
}
export const defilamaIsOnline = async()=>{
    let status;
        await fetch("https://api.llama.fi/protocols", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((result) =>
        {
            if(result){
                status=true;
            }
            else{
                status =false;
            }
        });
        return status;
};


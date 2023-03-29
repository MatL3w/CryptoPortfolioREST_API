
const crypto = {
};

fetch("https://api.llama.fi/protocols", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
.then((result) => result.json())
.then((data) => {
    const found = data.find(ele=>{
        return ele.name === "QiDao";
    })
    console.log(found);
    crypto.address=found.address;
    crypto.tvl = found.tvl;
    crypto.category = found.category;
    crypto.symbol = found.symbol;
    crypto.logo = found.logo;
    crypto.url = found.url;
    crypto.mcap =found.mcap;
    return fetch(`https://coins.llama.fi/prices/current/${found.address}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
})
.then((result) => result.json())
.then((data) =>{
    const key = Object.keys(data.coins)[0];
    crypto.price = data.coins[key].price;
    console.log(crypto);
})
.catch(err=>console.log(err));


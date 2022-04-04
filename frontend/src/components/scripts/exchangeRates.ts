import currencyNames from '@/assets/currencyNames.json';

class getExchangeRates {
  date: string;
  base: string;
  to: string;
  url = "http://localhost:8000/cconverter/";
  cachedRates: Object = {};
  constructor(date?: string, base?: string, to?: string) {
    if (date) this.date = date;
    else {
      const date = new Date();
      // TODO: change date to today's one in 13:00 (fix backend first)
      date.setDate(date.getDate() - 1);
      this.date = date.toISOString().slice(0, 10);
    }

    if (base) this.base = base;
    else this.base = "EUR";

    if(to) this.to = to;
    else this.to = '';

    this.url += this.date+'/'+this.base
    //if(this.to) this.url += '/'+this.to;
  }
  /*getRates() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.status == 200) {
          document.getElementById("date").innerHTML = JSON.parse(this.responseText).date;
          document.getElementById("base").innerHTML = JSON.parse(this.responseText).base;
        }
      }
    xhttp.open("GET", (this.url + this.date + "/" + this.base), true);
    xhttp.send();
    return(xhttp);
  }*/
  //// fetch() does ajax requests so it's probably counts ////
  async getRates() {
    //return this;
    //this.url + this.date + "/" + this.base
    //let response;

    /*return fetch(this.url, {cache: "force-cache"}).then(
      (res) => res.json()
    );*/
    let response = fetch(this.url, {cache: "force-cache"})
      .then((res) => {
        if(res.ok) return res.json()
        else throw new Error('Network response was not OK');
      })
      .then((json) => {
        if(json.date != this.date || json.base != this.base) throw new Error('Wrong data '+json.date+' '+json.base+' '+this.date+' '+this.base);
        else{
          if(this.to){
            if(json.rates[this.to]) return json.rates[this.to];
          }
          else return json.rates;
        }
      })
    return response;
    //return [200, response];
    /*fetch(this.url + this.date + "/" + this.base).then((res) => {
      if (res.ok) return [200, res.json()];
      else return [res.status, res.json()];
    }).catch((err) => {
      return [500, err];
    });*/
  }
}


function getRounded(value: number | string) {
  if(typeof value === 'string') value = parseFloat(value);
  if(!value) return 0
  let beforeDot = 0
  let afterDot = 0
  let switcher = false
  let valueStr = value.toString()
  for(var i = 0; i < valueStr.length; i++) {
    if (valueStr.charAt(i) == '.') {
      switcher = true
    } else {
      if (switcher) {
        afterDot += 1
      } else {
        beforeDot += 1
      }
    }
  }
  if(afterDot > 2 && beforeDot > 3) return value.toFixed(2)
  else if(afterDot > 4) return value.toFixed(4)
  else return value
}

function getCurrencyName(code: string){
  //let json = JSON.parse(dictionaryPath)
  let curName = currencyNames[code]

  if(!curName) return code
  return curName
} 

export { getExchangeRates, getRounded, getCurrencyName };
//export default getExchangeRates;

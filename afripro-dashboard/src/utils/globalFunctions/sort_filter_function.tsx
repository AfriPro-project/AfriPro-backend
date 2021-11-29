export const filter=(value:string,filterKey:any,staticData:any[])=>{
    var results = staticData.filter((data)=>{
        if(data[filterKey] != null){
            return data[filterKey].toLocaleLowerCase().includes(value.toLocaleLowerCase());
        }
        return [];
    });
    var data = JSON.parse(JSON.stringify(results));
    return data;
}

export const sort=(key:any,staticData:any[],asend:boolean)=>{
   var data = JSON.parse(JSON.stringify(staticData));
   var results = asend ? data.sort((a:any, b:any) => (a[key] > b[key]) ? 1 : -1) : data.sort((a:any, b:any) => (a[key] < b[key]) ? 1 : -1)
   var newData = JSON.parse(JSON.stringify(results));
   return newData;
}

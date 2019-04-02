/*
* check Query
* queryobj
*
*/
function cheackquery(queryobj) {
    for (let i in queryobj){
        if (typeof  queryobj[i] === 'string' && !queryobj[i]){
            return false
        }
    }
    return true;
}
function isexitkeys(obj,attrarr){
    for (let i=0;i<attrarr.length;i++){
        if (!obj.hasOwnProperty(attrarr[i])){
            return false
        }
    }
    return true;
};
function isexitkey(obj,attr){
    return obj.hasOwnProperty(attr) ?true :false;
}
function joinarr(arr,flag=','){
    return arr.join(flag)
};
function joinobj(obj,flag=',') {
    let str='';
    for ( let  i in obj ){
        str+=`'${obj[i]}'${flag}`
    }
    str=str.slice(0,-1);
    return str;
}
module.exports={
    cheackquery,
    isexitkey,
    isexitkeys,
    joinobj,
    joinarr
}
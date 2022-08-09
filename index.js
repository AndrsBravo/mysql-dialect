
class Query{
    #query;
    constructor(){    }    
    get(){
        return this.#query;
    }
}

module.exports = new Query();
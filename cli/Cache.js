module.exports = class Cache {

    createStore(key){
        this[key] = new Map();
    }

    deleteStore(key) {
        delete this[key];
    }

    getStore(key) {
        return this[key];
    }

    getItemInStore(store, storeKey) {
        return this[store].get(storeKey);
    }

    deleteItemInStore(store, storeKey) {
        return this[store].get(storeKey);
    }

    setItemInStore(store,storeKey,item){
        return this[store].set(storeKey,item);
    }

    checkItemInStore(store,storeKey){
        return this[store].has(storeKey);
    }

    setItem(key,item){
        this[key] = item;
    }
    
    getItem(key){
        return this[key];
    }
}
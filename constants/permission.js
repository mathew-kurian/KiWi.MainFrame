module.exports = {
    visitor: 0,
    friend: 1,
    resident : 2,
    owner : 3,

    lowest : 3,
    highest : 0,

    hasAllPairedKeyAccess : function(level){
        return level > module.exports.friend;
    }
};

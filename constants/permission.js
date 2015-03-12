module.exports = {
    visitor: 0,
    friend: 1,
    resident : 2,
    owner : 3,

    lowest : 3,
    highest : 0,

    hasAllPairedKeyAccess : function(level){
        return level > module.exports.visitor;
    },
    hasKeyCreateAccess : function(level){
        return level > module.exports.friend;
    },
    hasKeyEditAccess : function(level){
        return level > module.exports.friend;
    },
    hasKeyRemoveAccess: function(level){
        return level > module.exports.friend;
    }
};

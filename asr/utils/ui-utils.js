module.exports = {
    calcLightClasses: function (lock) {
        var lightCls = "light";

        if (lock) {
            switch (lock.powerState) {
                case 0:
                    lightCls += " red";
                    break;
                case 1:
                    lightCls += " green";
                    break;
                case 2:
                    lightCls += " blue";
                    break;
            }

            if (lock.alert) {
                lightCls += " on";
            }
        }

        return lightCls;
    },
    checkJoin : function(pre, actual, expect, res, post){
        return (pre || "") + (actual == expect ? res : "") + (post || "");
    }
};
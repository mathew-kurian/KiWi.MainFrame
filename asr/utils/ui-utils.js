
module.exports = {
    calcLightClasses : function(active, lock) {
        var lightCls = "light";

        if(lock && lock.powerState == 1) {
            lightCls += active ? " blue" : " green";
            if (lock.alert) {
                lightCls += " on";
            }
        } else {
            lightCls += " red";
        }

        return lightCls;
    }
};
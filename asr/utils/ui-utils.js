module.exports = {
    calcLightClasses: function (active, lock) {
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
    }
};
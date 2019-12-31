module.exports = class appplyFloat {
    async applyFloatCheck(date) {
        try {
            const now = new Date();
            const enteredDate = new Date(date);
            const result = Math.ceil((enteredDate - now) / (1000 * 3600 * 24));
            const decision = false;
            return (result < 7)?false:true;
        

        }

        catch (error) {
            console.log(error);

        }

    }
}
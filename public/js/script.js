<script>
    $(document).ready(function () {
        // setTimeout(() => {
        //     $('#fromDiv').hide('slow')
        // }, 1000);

        $("input#leave_type").on({
            keydown: function (e) {
                if (e.which === 32)
                    return false;
            },
            change: function () {
                this.value = this.value.replace(/\s/g, "");
            }
        });

        var inputBox = document.getElementById("number_leaves");

        var invalidChars = [
            "-",
            "+",
            "e",
        ];

        inputBox.addEventListener("input", function () {
            this.value = this.value.replace(/[e\+\-]/gi, "");
        });

        inputBox.addEventListener("keydown", function (e) {
            if (invalidChars.includes(e.key)) {
                e.preventDefault();
            }
        });
    })
</script>
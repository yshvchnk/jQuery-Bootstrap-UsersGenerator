$(document).ready(function () {
    var genderSelect = $("#gender-select");
    var usersTable = $("#users-table");

    var userCardAvatar = $("#usercard-avatar");
    var userCardName = $("#usercard-name");
    var userCardEmail = $("#usercard-email");
    var userCardPhone = $("#usercard-phone");

    // Validation email and phone number
    var validator = $("#form-create-user").validate();
    validator.element("#email-form");
    validator.element("#phone-form");

    // Mask for phone number
    $("#phone-form").mask("+(999) 99 999-99-99", {
        placeholder: "+(___) __ ___ __ __",
    });

    $("#spinner-request").hide();
    $("#message-request").hide();

    // Generate user
    $("#generate-user").click(function () {
        $("#modal-generate").modal("show");

        $("#generate").click(function () {
            var selectedGender = genderSelect.val();
            let url = "https://randomuser.me/api/";

            if (selectedGender) {
                url += "?gender=" + selectedGender;
            }
            $("#spinner-request").show();
            $.ajax({
                url: url,
                dataType: "json",
                success: function (data) {
                    var newRow = $("<tr>");
                    var img = $("<img>").attr(
                        "src",
                        data.results[0].picture.medium
                    );
                    var button = $("<button>")
                        .text("Learn More")
                        .attr("class", "btn btn-primary btn-small btn-more")
                        .data("user-id", data.info.seed);

                    newRow.append($("<td>").append(img));
                    newRow.append(
                        $("<td>").text(
                            data.results[0].name.first +
                                " " +
                                data.results[0].name.last
                        )
                    );
                    newRow.append($("<td>").text(data.results[0].email));
                    newRow.append($("<td>").text(data.results[0].cell));
                    newRow.append($("<td>").append(button));

                    usersTable.prepend(newRow);

                    userCardAvatar.attr("src", data.results[0].picture.large);
                    userCardName.text(
                        data.results[0].name.first +
                            " " +
                            data.results[0].name.last
                    );
                    userCardEmail.text(data.results[0].email);
                    userCardPhone.text(data.results[0].cell);

                    $("#spinner-request").hide();
                    $("#message-request")
                        .text("Everything is fine!")
                        .css("color", "green")
                        .show();
                    setTimeout(function () {
                        $("#message-request").hide();
                    }, 1000);
                },
                error: function () {
                    $("#spinner-request").hide();
                    $("#message-request")
                        .text("Something went wrong!")
                        .css("color", "red")
                        .show();
                    setTimeout(function () {
                        $("#message-request").hide();
                    }, 1000);
                },
            });
        });
    });

    // Create user
    $("#create-user").click(function () {
        $("#modal-create").modal("show");
        $("#form-create-user").submit(function (event) {
            event.preventDefault();

            var name = $("#fullname-form").val();
            var email = $("#email-form").val();
            var phone = $("#phone-form").val();
            var address = $("#address-form").val();
            var gender = $("#gender-form").val();
            var img = $("<img>").attr("alt", "Avatar");

            var file = $("#avatar-form").prop("files")[0];
            var reader = new FileReader();
            reader.onload = function () {
                avatar = reader.result;
                img.attr("src", reader.result);
                userCardAvatar.attr("src", reader.result);
            };
            if (file) {
                reader.readAsDataURL(file);
            }

            var newUser = {
                name: name,
                email: email,
                phone: phone,
                address: address,
                gender: gender,
            };

            var button = $("<button>")
                .text("Learn More")
                .attr("class", "btn btn-success btn-small btn-more")
                .data("user-id", newUser.email);

            var newRow = $("<tr>");
            newRow.append($("<td>").addClass("table-pic").append(img));
            newRow.append($("<td>").text(newUser.name));
            newRow.append($("<td>").text(newUser.email));
            newRow.append($("<td>").text(newUser.phone));
            newRow.append($("<td>").append(button));

            usersTable.prepend(newRow);

            userCardName.text(newUser.name);
            userCardEmail.text(newUser.email);
            userCardPhone.text(newUser.phone);
        });
    });

    // Show user info
    function showUserInfo(userId) {
        $.ajax({
            url: "https://randomuser.me/api/?seed=" + userId,
            dataType: "json",
            success: function (data) {
                $("#avatar-info").attr("src", data.results[0].picture.large);
                $("#name-info").text(
                    data.results[0].name.first + " " + data.results[0].name.last
                );
                $("#email-info").text(data.results[0].email);
                $("#phone-info").text(data.results[0].cell);
                $("#gender-info").text(data.results[0].gender);
                $("#address-info").text(
                    data.results[0].location.country +
                        ", " +
                        data.results[0].location.city +
                        ", " +
                        data.results[0].location.street.name +
                        ", " +
                        data.results[0].location.street.number
                );

                $("#user-modal").modal("show");
            },
            error: function () {
                alert("Error fetching user info!");
            },
        });
    }

    // Show user info on click
    $(document).on("click", ".btn-more", function () {
        var userId = $(this).data("user-id");
        showUserInfo(userId);
    });
});

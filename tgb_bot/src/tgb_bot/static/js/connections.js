handleShowLoadingOverlay = function () {
    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "flex inline-flex";
};
handleHideLoadingOverlay = function () {
    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "none";
};
handleSendCode = function () {
    const sendCodeButton = document.getElementById("conn_auth_gss_send_code");
};
document.addEventListener("DOMContentLoaded", function () {
    const sendCodeButton = document.getElementById("conn_auth_gss_send_code");
    const checkCodeButton = document.getElementById("conn_auth_gss_check_code");
    sendCodeButton.addEventListener("click", function () {
        handleShowLoadingOverlay();
        setTimeout(function () {
            handleHideLoadingOverlay();
        }, 2000);
    });
    checkCodeButton.addEventListener("click", function () {
        handleShowLoadingOverlay();
        setTimeout(function () {
            handleHideLoadingOverlay();
        }, 2000);
    });
});

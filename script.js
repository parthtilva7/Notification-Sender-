if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("serviceworker.js", { scope: "/" })
    .then(function (registration) {
      console.log("Successful:", registration);
    })
    .catch(function (error) {
      console.log("Unsuccessful:", error);
    });
} else {
  console.log("Something happened, Please try again!");
}

document.addEventListener("DOMContentLoaded", function () {
  const requestPermissionButton = document.getElementById("requestPermission");
  const notificationForm = document.getElementById("notificationForm");
  const titleInput = document.getElementById("title");
  const bodyInput = document.getElementById("body");

  requestPermissionButton.addEventListener("click", function () {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          showMessage("Permission Granted!");
          hideButton();
          showForm();
        } else {
          showMessage("Permission denied!");
        }
      });
    } else {
      showMessage("Permission already granted!");
      hideButton();
      showForm();
    }
  });

  notificationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = titleInput.value;
    const body = bodyInput.value;
    if (Notification.permission === "granted") {
      showNotification(title, body);
    } else {
      showMessage("Please grant notification permission first!");
    }
  });

  function showNotification(title, body) {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(title, {
          body: body,
          actions: [
            { action: "agree", title: "Agree" },
            { action: "disagree", title: "Disagree" },
          ],
        });
      });
    } else {
      console.log("Service workers are not supported in this browser.");
    }
  }

  function showMessage(message) {
    const outputDiv = document.getElementById("output");
    outputDiv.textContent = message;
    outputDiv.classList.remove("hidden");
  }

  function hideButton() {
    requestPermissionButton.classList.add("hidden");
  }

  function showForm() {
    notificationForm.classList.remove("hidden");
  }
});
navigator.serviceWorker.addEventListener("message", function (event) {
  if (event.data.type === "notificationClick") {
    const message = event.data.message;
    let textMessage = document.getElementById("textmessage");
    textMessage.innerHTML = event.data.message;
  }
});

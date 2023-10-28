const clearButton = document.getElementById("clear");

clearButton.onclick = () => {
    const confirmed = confirm("Are you sure you want to delete all tabs?")
    if (!confirmed) return

    browser.runtime.sendMessage({ type: "DELETE_ALL" })
}
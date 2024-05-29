const setCookie = (name, value, days) => {
    let cookie = name + "=" + encodeURIComponent(value);
    if (days) {
        cookie += "; max-age=" + days * 24 * 60 * 60;
    }
    cookie += "; path=/";
    document.cookie = cookie;
};

const getCookieByName = name => {
    const cookies = document.cookie;
    let start = cookies.indexOf(name + "=");
    if (start === -1) { // no cookie with that name
        return "";
    } else {
        start = start + (name.length + 1);
        let end = cookies.indexOf(";", start);
        if (end === -1) { // if no semicolon, last cookie
            end = cookies.length;
        }
        const cookieValue = cookies.substring(start, end);
        return decodeURIComponent(cookieValue);
    }
};

const deleteCookie = name => document.cookie = name + "=''; max-age=0; path=/";

$(document).ready(() => {
    $("#add_task").click(() => {
        const task = $("#task").val().trim();  // textbox = $("#task"); const task = textbox.val(); 
        if (task === "") {                     // https://www.w3schools.com/jquery/jquery_dom_set.asp
            alert("Please enter a task.");
            $("#task").focus();                // textbox.focus(); 
            return;
        }                                      // } else {
        let tasks = getCookieByName("tasks") || "";
        tasks += task + "\n";                  // https://www.w3schools.com/jquery/jquery_selectors.asp
        setCookie("tasks", tasks, 21);         // 21 day persistent cookies
        displayTasks();                        // textbox.val("");
        $("#task").val("").focus();            // $("#task_list").val(getCookieByName("tasks")); // textbox.focus()
    });

    $("#clear_tasks").click(() => {
        deleteCookie("tasks");
        displayTasks(); // $("#task_list").val(""); // $("#task").focus();
    });

    // https://www.w3schools.com/jquery/jquery_traversing_ancestors.asp
    $("#task_list").on("change", "input[type='checkbox']", function () {
        const taskIndex = $(this).parent().index(); // Get index of the task in the list
        const tasks = getCookieByName("tasks").split("\n"); // Get tasks from cookie
        tasks[taskIndex] = $(this).is(":checked") ? "✔" + tasks[taskIndex] : tasks[taskIndex].substring(1); // Update task with checkbox state
        setCookie("tasks", tasks.join("\n"), 21); // Save updated tasks to cookie
        displayTasks(); // Refresh task list
    });

    // https://www.w3schools.com/JS/js_events.asp   https://dev.to/ediomojose/pop-up-modal-using-html-css-and-javascript-to-create-a-modal-19gd

    // click event handler for tasks
    $("#task_list").on("click", ".task-item", function () {
        const taskText = $(this).text().trim();
        $("#modal-task-text").text(taskText);
        $("#task-details-modal").show();
    });

    // this is to close the button click handler
    $("#close-modal").click(function () {
        $("#task-details-modal").hide();
    });

    // Display tasks on initial load
    displayTasks(); // $("#task_list").val(getCookieByName("tasks"));
    // $("#task").focus();
});



function displayTasks() {
    const tasks = getCookieByName("tasks");
    if (tasks) {
        const tasksArray = tasks.split("\n").filter(task => task.trim() !== "");
        const taskList = $("#task_list");
        taskList.empty(); // this clears previous tasks
        tasksArray.forEach(task => {
            const taskElement = $("<div>").addClass("task-item"); // .text(task.substring(1)); // this removes check box character
            const checkbox = $("<input>").attr("type", "checkbox");
            if (task.startsWith("✔")) { // const checkMark = "\u2714";
                checkbox.prop("checked", true); // Check the checkbox if task is completed
                taskElement.addClass("completed"); // Add completed class to the task
                task = task.substring(1);
            }
            taskElement.append(checkbox);

            taskElement.append($("<span>").text(task));
            taskList.append(taskElement);  // https://www.w3schools.com/jquery/html_append.asp
        });
    }
}
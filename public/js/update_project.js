function updateProject(data) {
    let select = document.getElementById('update_donor_select');
    let projectid = select.options[select.selectedIndex].value;
    for (let obj in data) {
        if (data[obj].project_id == projectid) {          
            document.getElementById('update_project_name').value = data[obj].name;
            document.getElementById('update_amount_needed').value = data[obj].amount_needed;
            document.getElementById('update_amount_raised').value = data[obj].amount_raised;
        }
    };
    return;
};

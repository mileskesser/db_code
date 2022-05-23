function updateCharity(data) {
    let select = document.getElementById('update_charity_select');
    let charityid = select.options[select.selectedIndex].value;
    for (let obj in data) {
        if (data[obj].charity_id == charityid) {          
            document.getElementById('update_charity_name').value = data[obj].name;
            document.getElementById('update_charity_location').value = data[obj].location;
        }
    };
    return;
};

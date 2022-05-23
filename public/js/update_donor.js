function updateDonor(data) {
    let select = document.getElementById('update_donor_select');
    let donorid = select.options[select.selectedIndex].value;
    for (let obj in data) {
        if (data[obj].donor_id == donorid) {          
            document.getElementById('update_donor_name').value = data[obj].name;
            document.getElementById('update_donor_email').value = data[obj].email;
        }
    };
    return;
};

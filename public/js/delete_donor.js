
function deleteDonor(personID) {
  let link = '/delete-donor-ajax/';
  let data = {
    donor_id: personID
  };
  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8", 
    success: function(result) {
      deleteRow(personID);
    }
  });
}

function deleteRow(personID){

    let table = document.getElementById("donor-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == personID) {
            table.deleteRow(i);
            break;
       }
    }
}

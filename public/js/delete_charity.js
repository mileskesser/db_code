
function deleteCharity(charityID) {
  let link = '/delete-charity-ajax/';
  let data = {
    charity_id: charityID
  };
  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8", 
    success: function(result) {
      deleteRow(charityID);
    }
  });
}

function deleteRow(charityID){

    let table = document.getElementById("charities-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == charityID) {
            table.deleteRow(i);
            break;
       }
    }
}
